"use server"

import { prisma } from "@/prisma/connection"
import { Product } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/mail"

export async function addItemToCart(product: Product, customerId: string) {
    let my_cart = null
    const cart = await prisma.cart.findFirst({
        where: { customerId: customerId, isOrdered: false }
    })

    if (!cart) {
        my_cart = await prisma.cart.create({
            data: {
                customerId: customerId,
                totalPrice: product.price,
                cartItems: {
                    create: {
                        wasRequested: false,
                        price: product.price,
                        quantity: 1,
                        productId: product.id
                    }
                }
            }
        })
    } else {
        my_cart = await prisma.cart.update({
            where: {id: cart.id},
            data: {
                totalPrice: cart.totalPrice + product.price,
                cartItems: {
                    create: {
                        wasRequested: false,
                        price: product.price,
                        quantity: 1,
                        productId: product.id
                    }
                }
                
            }
        })
    }
    return my_cart
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true, product: true }
    });

    if (!cartItem) throw new Error("Cart item not found");

    const priceDifference = cartItem.product.price * (quantity - cartItem.quantity);

    await prisma.cart.update({
        where: { id: cartItem.cartId },
        data: {
            totalPrice: cartItem.cart.totalPrice + priceDifference
        }
    });

    const updatedCartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
    });
    revalidatePath("/home/products/cart")
    return updatedCartItem;
}

export async function removeCartItem(cartItemId: string) {
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true }
    });

    if (!cartItem) throw new Error("Cart item not found");

    await prisma.cart.update({
        where: { id: cartItem.cartId },
        data: {
            totalPrice: cartItem.cart.totalPrice - (cartItem.price * cartItem.quantity)
        }
    });
    const deletedCartItem = await prisma.cartItem.delete({
        where: { id: cartItemId }
    });
    revalidatePath("/home/products/cart")
    return deletedCartItem;
}

export async function createCheckoutSession(cartId: string) {
    // Get cart items first to know quantities
    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: { include: { product: true } }, customer: true }
    });

    if (!cart) throw new Error('Cart not found');
    if (cart.cartItems.length === 0) throw new Error("Cart is empty");

    cart.cartItems.map(item=>{
        sendEmail({
            to: cart.customer.email!,
            subject: "Order Confirmation",
            text: `Your order has been confirmed. Here are the details:`,
            html: `
                <h2>Order Confirmation</h2>
                <p>Thank you for your order!</p>
                <p>Here are the details of your order:</p>
                <ul>
                    <li>Product: ${item.product.name}</li>
                    <li>Quantity: ${item.quantity}</li>
                    <li>Price: $${item.price}</li>
                </ul>
                <p>Thank you for shopping with us!</p>
            `
        })
    })

    return await prisma.$transaction(async (tx) => {
        // Update each product's stock
        for (const item of cart.cartItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { 
                    stock: { decrement: item.quantity }
                }
            });
            
        }
        // Mark cart as ordered
        return await tx.cart.update({
            where: { id: cartId },
            data: { isOrdered: true },
            include: { cartItems: true }
        });
    });
}

export async function updateDeliveryStatus (cartItemId: string, isDelivered: boolean) {
    const cartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { isDelivered },
        include: { cart: { include: { customer: true } }, product: true }
    })
    sendEmail({
        to: cartItem.cart.customer.email!,
        subject: "Product(s) Delivered",
        text: `Your order has been confirmed. Here are the details:`,
        html: `
            <h2>Order Delivered</h2>
            <p>Thank you for your order!</p>
            <p>Here are the details of your order:</p>
            <ul>
                <li>Product: ${cartItem.product.name}</li>
                <li>Quantity: ${cartItem.quantity}</li>
                <li>Price: $${cartItem.price}</li>
            </ul>
            <p>Thank you for shopping with us!</p>
        `
    })
    return cartItem
}
"use server"

import { prisma } from "@/prisma/connection"
import { Product } from "@prisma/client"
import { revalidatePath } from "next/cache"

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
        include: { cartItems: { include: { product: true } } }
    });

    if (!cart) throw new Error('Cart not found');
    if (cart.cartItems.length === 0) throw new Error("Cart is empty");

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
    return await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { isDelivered }
    })
}
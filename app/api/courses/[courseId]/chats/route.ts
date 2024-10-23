import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/connection'
import { currentUser } from '@/lib/auth'


export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const studyGroup = await prisma.studyGroup.findFirst({
      where: { courseId: params.courseId },
    })

    if (!studyGroup) {
      return NextResponse.json({ error: 'Study group not found' }, { status: 404 })
    }

    const chats = await prisma.chat.findMany({
      where: { studyGroupId: studyGroup.id },
      include: {
        participants: true,
      },
    })
    return NextResponse.json(chats)
  } catch (error) {
    console.error('Error fetching study group chats:', error)
    return NextResponse.json({ error: 'Failed to fetch study group chats' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const user = await currentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, participants } = await request.json()

  try {
    const studyGroup = await prisma.studyGroup.findFirst({
      where: { courseId: params.courseId },
    })

    if (!studyGroup) {
      return NextResponse.json({ error: 'Study group not found' }, { status: 404 })
    }

    const chat = await prisma.chat.create({
      data: {
        name: name,
        studyGroupId: studyGroup.id,
        participants: {
          create: participants.map((userId: string) => ({
            userId: userId,
          })),
        },
      },
      include: {
        participants: true,
      },
    })

    return NextResponse.json(chat)
  } catch (error) {
    console.error('Error creating study group chat:', error)
    return NextResponse.json({ error: 'Failed to create study group chat' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/connection'
import { currentUser } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { courseId: params.courseId },
      include: {
        uploader: { select: { name: true } },
        votes: true,
      },
    })
    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
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

  const { assignmentId, value } = await request.json()

  try {
    const vote = await prisma.assignmentVote.upsert({
      where: {
        assignmentId_userId: {
          assignmentId: assignmentId,
          userId: user.id,
        },
      },
      update: { value: value },
      create: {
        assignmentId: assignmentId,
        userId: user.id,
        value: value,
      },
    })

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Error voting on assignment:', error)
    return NextResponse.json({ error: 'Failed to vote on assignment' }, { status: 500 })
  }
}
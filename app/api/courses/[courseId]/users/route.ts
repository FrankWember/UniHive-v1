import { NextResponse } from 'next/server'
import { getCourseUsers } from '@/utils/data/courses'

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const users = await getCourseUsers(params.courseId)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching course users:', error)
    return NextResponse.json({ error: 'Failed to fetch course users' }, { status: 500 })
  }
}
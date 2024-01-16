import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId, profilePhotoUrl } = body;

    if (!userId || !profilePhotoUrl) {
        return NextResponse.json(
        JSON.stringify({ message: 'Required fields are missing' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.users.update({
      where: { id: userId },
      data: { profilePhotoUrl },
    });

    return NextResponse.json(
      JSON.stringify({ message: 'Profile photo updated successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to update profile photo:', error);
    return NextResponse.json(
      JSON.stringify({ message: 'Failed to update profile photo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

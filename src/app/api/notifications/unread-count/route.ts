import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NotificationCountType } from "@/lib/types";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const unreadCount = await prisma.notification.count({
      where: { receipientId: user.id, read: false },
    });

    const data: NotificationCountType = {
      unreadCount,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

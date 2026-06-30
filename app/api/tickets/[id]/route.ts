import tickets from @/app/database;
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    const ticket = tickets.find(ticket => ticket.id === parseInt(id));

    return NextResponse.json(ticket);
}

export async function Delete(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const index = tickets.findIndex(ticket => ticket.id === parseInt(id));

    if (index !== -1) {
        tickets.splice(index, 1);
        return NextResponse.json({ message: "Ticket deleted successfully" });
    } else {
        return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }
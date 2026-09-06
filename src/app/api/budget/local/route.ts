import { createClient } from "@/lib/supabase/client"
import CreateDiscussion from "@/lib/supabase/create-discussion"
import { GetUserID } from "@/lib/supabase/get-user-id"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const query = url.searchParams
  const department = query.get("department")
  const year = query.get("year")

  const supabase = createClient()
  let sql = supabase
    .from("local_budget")
    .select("data, department, year, data_source")

  if (department) {
    sql = sql.ilike("department", `${department}`)
  }
  if (year) {
    sql = sql.eq("year", year)
  }

  sql = sql.order("id", { ascending: false })

  const { data: local, error } = await sql

  return NextResponse.json(local ?? [])
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = await GetUserID()

  // TODO: Insert data for budget first
  const supabase = createClient()
  const { data: budget, error } = await supabase
    .from("local_budget")
    .insert({
      data: body.data,
      department: body.department,
      year: body.year,
      data_source: body.data_source
    })
    .select("id")
    .single()

  if (error) {
    return NextResponse.json({
      error: error.message
    })
  }

  // TODO: Validation for user's existence
  if (!user) {
    return NextResponse.json({
      error: "User not found"
    })
  }

  // TODO: Insert data for discussion
  const discussionMeta = await CreateDiscussion("local_budget", {
    title: body.title,
    data_source: body.data_source,
    content: body.content,
    reference_id: budget.id,
    user_id: user,
    type: "local_budget"
  })

  return NextResponse.json({
    "message": "Data Added successfully",
    "id": discussionMeta
  })
}

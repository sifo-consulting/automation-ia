import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      companyName,
      companySize,
      sector,
      role,
      tasks,
      customTask,
      taskDetails,
      contactName,
      contactEmail,
      contactPhone,
      selectedOption,
      roiResults,
    } = body

    if (!contactName || !contactEmail || !companySize || !sector || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const lead = await db.diagnosticLead.create({
      data: {
        companyName: companyName || null,
        companySize,
        sector,
        role,
        tasks: JSON.stringify(tasks || []),
        taskDetails: JSON.stringify(taskDetails || {}),
        timeLostPerMonth: roiResults?.timeLostPerMonth || 0,
        costPerYear: roiResults?.costPerYear || 0,
        potentialSavings: roiResults?.potentialSavings || 0,
        recommendedSolution: JSON.stringify(roiResults?.recommendations || []),
        timeline: null,
        costRange: null,
        contactName,
        contactEmail,
        contactPhone: contactPhone || null,
        selectedOption: selectedOption || null,
        completed: true,
      },
    })

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Diagnostic submitted successfully',
    })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { error: 'Failed to submit diagnostic' },
      { status: 500 }
    )
  }
}

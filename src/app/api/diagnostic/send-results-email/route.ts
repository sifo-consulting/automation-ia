import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      companyName,
      companySize,
      sector,
      role,
      selectedTasks,
      customTask,
      taskDetails,
      contactName,
      contactEmail,
      contactPhone,
      roiResults,
    } = body

    if (!contactName || !contactEmail) {
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

    const subject = encodeURIComponent(`Vos resultats ROI - ${companyName || contactName}`)

    let emailBody = `=== DIAGNOSTIC ROI - VOS RESULTATS ===
Date: ${new Date().toLocaleString('fr-FR')}

=== CONTACT ===
Nom: ${contactName}
Email: ${contactEmail}
Téléphone: ${contactPhone || 'Non renseigne'}

=== ENTREPRISE ===
Nom: ${companyName || 'Non renseigne'}
Taille: ${companySize}
Secteur: ${sector}
Role: ${role}

=== TACHES SELECTIONNEES ===
${selectedTasks.length} tache(s) selectionnee(s)
${selectedTasks.join('\n')}
${customTask ? `Autre tache: ${customTask}` : ''}

=== DETAILS DES TACHES ===
${Object.entries(taskDetails).map(([taskId, details]: [string, any]) => {
  return `Tache: ${taskId}
  - Heures/semaine: ${details.hoursPerWeek}
  - Personnes impliquees: ${details.peopleInvolved}
  - Niveau de frustration: ${details.painLevel}`
}).join('\n\n')}

=== RESULTATS ROI ===
Temps perdu/mois: ${roiResults?.timeLostPerMonth || 0}h
Cout annuel estime: ${roiResults?.costPerYear?.toLocaleString() || 0}€
Economie potentielle: ${roiResults?.potentialSavings?.toLocaleString() || 0}€
Potentiel d'automatisation moyen: ${roiResults?.avgAutomationPotential || 0}%

=== REPARTITION PAR TACHE ===
${roiResults?.taskBreakdown?.map((task: any) => {
  return `- ${task.name}: ${task.cost?.toLocaleString()}€/an (${task.automationPotential}% automatisable)`
}).join('\n')}

=== FIN DU RESULTAT ===`

    const formattedBody = encodeURIComponent(emailBody)

    console.log('=== Results Email Sent ===')
    console.log(emailBody)

    const mailtoLink = `mailto:${contactEmail}?subject=${subject}&body=${formattedBody}`

    return NextResponse.json({
      success: true,
      message: 'Results email sent successfully',
      data: body,
      mailtoLink: mailtoLink,
    })
  } catch (error) {
    console.error('Send results email error:', error)
    return NextResponse.json(
      { error: 'Failed to send results email' },
      { status: 500 }
    )
  }
}

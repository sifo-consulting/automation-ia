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

    const subject = encodeURIComponent(`Nouveau Diagnostic ROI - ${companyName || contactName}`)

    let emailBody = `=== DIAGNOSTIC ROI NEHOS GROUPE ===
Date: ${new Date().toLocaleString('fr-FR')}

=== INFORMATIONS CONTACT ===
Nom: ${contactName}
Email: ${contactEmail}
Téléphone: ${contactPhone || 'Non renseigne'}

=== INFORMATIONS ENTREPRISE ===
Nom de l'entreprise: ${companyName || 'Non renseigne'}
Taille: ${companySize}
Secteur: ${sector}
Rôle: ${role}

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
Coût annuel estime: ${roiResults?.costPerYear?.toLocaleString() || 0}€
Economie potentielle: ${roiResults?.potentialSavings?.toLocaleString() || 0}€
Potentiel d'automatisation moyen: ${roiResults?.avgAutomationPotential || 0}%

=== REPARTITION PAR TACHE ===
${roiResults?.taskBreakdown?.map((task: any) => {
  return `- ${task.name}: ${task.cost?.toLocaleString()}€/an (${task.automationPotential}% automatisable)`
}).join('\n')}

=== RECOMMANDATIONS ===
${roiResults?.recommendations?.map((rec: any, idx: number) => {
  return `${idx + 1}. ${rec.title}
   Priorite: ${rec.priority}
   Timeline: ${rec.timeline}
   Cout: ${rec.costRange}
   ROI: ${rec.roi}
   Description: ${rec.description}`
}).join('\n\n')}

=== OPTION SELECTIONNEE ===
${selectedOption === 'audit-premium' ? 'Audit Premium (Payant)' : selectedOption === 'call-with-expert' ? 'Call Express (Gratuit)' : 'Non selectionne'}

=== FIN DU DIAGNOSTIC ===`

    const formattedBody = encodeURIComponent(emailBody)

    console.log('=== Diagnostic Data ===')
    console.log(emailBody)

    const mailtoLink = `mailto:chokri@nehos-groupe.com?subject=${subject}&body=${formattedBody}`

    return NextResponse.json({
      success: true,
      message: 'Diagnostic submitted successfully',
      data: body,
      mailtoLink: mailtoLink,
    })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { error: 'Failed to submit diagnostic' },
      { status: 500 }
    )
  }
}

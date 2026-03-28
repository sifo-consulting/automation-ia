import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tasks, taskDetails, companySize } = body

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: 'Invalid tasks data' },
        { status: 400 }
      )
    }

    if (!taskDetails || typeof taskDetails !== 'object') {
      return NextResponse.json(
        { error: 'Invalid task details' },
        { status: 400 }
      )
    }

    const hourlyRates: { [key: string]: number } = {
      '1-10': 45,
      '11-50': 55,
      '51-200': 70,
      '200+': 85,
    }

    const hourlyRate = hourlyRates[companySize] || 55

    const taskMetadata: { [key: string]: { automationPotential: number; complexityMultiplier: number } } = {
      'support-email': { automationPotential: 0.8, complexityMultiplier: 1.0 },
      'support-chat': { automationPotential: 0.7, complexityMultiplier: 1.2 },
      'support-phone': { automationPotential: 0.4, complexityMultiplier: 1.5 },
      'support-tickets': { automationPotential: 0.75, complexityMultiplier: 1.1 },
      'finance-invoices': { automationPotential: 0.9, complexityMultiplier: 0.9 },
      'finance-reconciliation': { automationPotential: 0.85, complexityMultiplier: 1.0 },
      'finance-expenses': { automationPotential: 0.7, complexityMultiplier: 0.8 },
      'finance-reports': { automationPotential: 0.6, complexityMultiplier: 1.3 },
      'admin-scheduling': { automationPotential: 0.75, complexityMultiplier: 0.7 },
      'admin-onboarding': { automationPotential: 0.5, complexityMultiplier: 1.4 },
      'admin-documentation': { automationPotential: 0.3, complexityMultiplier: 1.2 },
      'admin-approvals': { automationPotential: 0.8, complexityMultiplier: 1.1 },
      'ops-inventory': { automationPotential: 0.7, complexityMultiplier: 1.1 },
      'ops-orders': { automationPotential: 0.85, complexityMultiplier: 1.0 },
      'ops-quality': { automationPotential: 0.5, complexityMultiplier: 1.3 },
      'ops-reporting': { automationPotential: 0.65, complexityMultiplier: 1.0 },
    }

    const taskNames: { [key: string]: string } = {
      'support-email': 'Emails clients',
      'support-chat': 'Support en direct',
      'support-phone': 'Appels entrants',
      'support-tickets': 'Gestion tickets',
      'finance-invoices': 'Facturation',
      'finance-reconciliation': 'Rapprochement',
      'finance-expenses': 'Depenses',
      'finance-reports': 'Rapports fin.',
      'admin-scheduling': 'Reunions',
      'admin-onboarding': 'Onboarding',
      'admin-documentation': 'Documentation',
      'admin-approvals': 'Validations',
      'ops-inventory': 'Stock',
      'ops-orders': 'Commandes',
      'ops-quality': 'Qualite',
      'ops-reporting': 'Rapports ops.',
    }

    let totalHoursPerWeek = 0
    const taskBreakdown: any[] = []

    tasks.forEach((taskId: string) => {
      const details = taskDetails[taskId]
      if (!details) return

      const metadata = taskMetadata[taskId] || { automationPotential: 0.5, complexityMultiplier: 1.0 }
      const taskName = taskNames[taskId] || taskId

      const weeklyHours = details.hoursPerWeek
      const monthlyHours = weeklyHours * 4.33
      const yearlyHours = monthlyHours * 12

      const costPerMonth = yearlyHours * hourlyRate / 12
      const costPerYear = yearlyHours * hourlyRate * metadata.complexityMultiplier

      totalHoursPerWeek += weeklyHours

      taskBreakdown.push({
        id: taskId,
        name: taskName,
        hoursPerWeek: weeklyHours,
        monthlyHours: Math.round(monthlyHours),
        yearlyHours: Math.round(yearlyHours),
        costPerMonth: Math.round(costPerMonth),
        cost: Math.round(costPerYear),
        automationPotential: Math.round(metadata.automationPotential * 100),
      })
    })

    const timeLostPerMonth = totalHoursPerWeek * 4.33
    const costPerYear = taskBreakdown.reduce((sum, task) => sum + task.cost, 0)

    const avgAutomationPotential = taskBreakdown.reduce(
      (sum, task) => sum + task.automationPotential,
      0
    ) / taskBreakdown.length

    const potentialSavings = costPerYear * (avgAutomationPotential / 100)

    const automatable = taskBreakdown.filter(t => t.automationPotential >= 70).length
    const partially = taskBreakdown.filter(t => t.automationPotential >= 50 && t.automationPotential < 70).length
    const complex = taskBreakdown.filter(t => t.automationPotential < 50).length
    const total = taskBreakdown.length

    const automatablePercentage = Math.round((automatable / total) * 100)
    const partiallyAutomatable = Math.round((partially / total) * 100)
    const complexPercentage = Math.round((complex / total) * 100)

    const recommendations = generateRecommendations(
      tasks,
      taskBreakdown,
      avgAutomationPotential,
      costPerYear
    )

    const results = {
      timeLostPerMonth: Math.round(timeLostPerMonth),
      costPerYear: Math.round(costPerYear),
      potentialSavings: Math.round(potentialSavings),
      avgAutomationPotential: Math.round(avgAutomationPotential),
      automatablePercentage,
      partiallyAutomatable,
      complexPercentage,
      taskBreakdown,
      recommendations,
    }

    console.log('=== ROI Calculation Complete ===')
    console.log(JSON.stringify(results, null, 2))

    return NextResponse.json(results)
  } catch (error) {
    console.error('ROI calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate ROI' },
      { status: 500 }
    )
  }
}

function generateRecommendations(
  tasks: string[],
  taskBreakdown: any[],
  avgAutomationPotential: number,
  costPerYear: number
) {
  const recommendations: any[] = []

  const hasSupportTasks = tasks.some((t: string) => t.startsWith('support-'))
  const hasFinanceTasks = tasks.some((t: string) => t.startsWith('finance-'))
  const hasAdminTasks = tasks.some((t: string) => t.startsWith('admin-'))
  const hasOpsTasks = tasks.some((t: string) => t.startsWith('ops-'))

  const highCostTasks = taskBreakdown.filter(t => t.cost > 10000)
  const highPriority = highCostTasks.length > 0

  if (hasSupportTasks) {
    const supportCost = taskBreakdown
      .filter(t => t.id.startsWith('support-'))
      .reduce((sum, t) => sum + t.cost, 0)

    recommendations.push({
      title: 'Agent IA Support Client',
      description: 'Automatisez 70-80% des demandes clients avec un chatbot intelligent. Reponse instantanee 24/7, escalade automatique vers les humains pour les cas complexes.',
      icon: '🤖',
      color: 'from-purple-500/20 to-indigo-500/20',
      priority: highCostTasks.some(t => t.id.startsWith('support-')) ? 'Haute' : 'Moyenne',
      timeline: '4-8 semaines',
      costRange: '11,250€ - 33,750€',
      roi: '3-5x',
    })
  }

  if (hasFinanceTasks || hasAdminTasks) {
    const financeAdminCost = taskBreakdown
      .filter(t => t.id.startsWith('finance-') || t.id.startsWith('admin-'))
      .reduce((sum, t) => sum + t.cost, 0)

    recommendations.push({
      title: 'Automatisation Workflows Metier',
      description: 'Streamlinez vos processus administratifs et financiers avec des automatisations sans-code. Facturation, approbations, reporting en un clic.',
      icon: '⚡',
      color: 'from-blue-500/20 to-cyan-500/20',
      priority: highPriority ? 'Haute' : 'Moyenne',
      timeline: '6-12 semaines',
      costRange: '18,750€ - 56,250€',
      roi: '2-4x',
    })
  }

  if (hasOpsTasks) {
    const opsCost = taskBreakdown
      .filter(t => t.id.startsWith('ops-'))
      .reduce((sum, t) => sum + t.cost, 0)

    recommendations.push({
      title: 'Systeme de Gestion Intelligent',
      description: 'Centralisez et automatisez vos operations: inventaire en temps reel, commandes automatiques, rapports generes automatiquement.',
      icon: '📊',
      color: 'from-green-500/20 to-emerald-500/20',
      priority: highPriority ? 'Haute' : 'Moyenne',
      timeline: '8-16 semaines',
      costRange: '30,000€ - 90,000€',
      roi: '2-3x',
    })
  }

  if (avgAutomationPotential < 60 || costPerYear > 100000) {
    recommendations.push({
      title: 'Solution Sur Mesure',
      description: 'Analyse approfondie et developpement de solutions personnalisees pour repondre a vos besoins specifiques. Integration complete avec vos systemes existants.',
      icon: '🎯',
      color: 'from-amber-500/20 to-orange-500/20',
      priority: 'Haute',
      timeline: '12-24 semaines',
      costRange: '60,000€ - 187,500€',
      roi: '1.5-3x',
    })
  }

  recommendations.sort((a, b) => {
    const priorityScore = { 'Haute': 3, 'Moyenne': 2, 'Faible': 1 }
    return priorityScore[b.priority] - priorityScore[a.priority]
  })

  return recommendations.slice(0, 3)
}

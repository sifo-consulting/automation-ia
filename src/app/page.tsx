'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { useTheme } from 'next-themes'
import {
  Brain,
  Rocket,
  TrendingUp,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Euro,
  Sparkles,
  Target,
  Award,
  Phone,
  FileText,
  Download,
  Moon,
  Sun,
  Users,
  Building2,
  Briefcase,
  Activity,
  Layers,
  MessageSquare,
  Mail,
  Calculator,
  FileCheck,
  Wrench,
  Settings,
  CreditCard,
  Database,
  Globe,
  Store,
  RefreshCw,
  Send,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts'

interface DiagnosticData {
  step: number
  companyName?: string
  companySize: string
  sector: string
  role: string
  selectedTasks: string[]
  customTask?: string
  taskDetails: {
    [taskId: string]: {
      hoursPerWeek: number
      peopleInvolved: number
      painLevel: number
    }
  }
  contactName: string
  contactEmail: string
  contactPhone?: string
  selectedOption?: 'audit-premium' | 'call-with-expert'
  earlyContactData: {
    contactName?: string
    contactEmail?: string
    contactPhone?: string
  }
}

interface TaskCategory {
  id: string
  name: string
  icon: any
  tasks: {
    id: string
    name: string
    description: string
  }[]
}

const taskCategories: TaskCategory[] = [
  {
    id: 'support',
    name: 'Support Client',
    icon: MessageSquare,
    tasks: [
      { id: 'support-email', name: 'Reponses e-mails clients', description: 'Traitement des demandes par e-mail' },
      { id: 'support-chat', name: 'Support en direct', description: 'Chat en temps reel' },
      { id: 'support-phone', name: 'Appels entrants', description: 'Gestion des appels clients' },
      { id: 'support-tickets', name: 'Gestion des tickets', description: 'Suivi des demandes d\'assistance' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance & Facturation',
    icon: Euro,
    tasks: [
      { id: 'finance-invoices', name: 'Creation de factures', description: 'Emission des factures clients' },
      { id: 'finance-reconciliation', name: 'Rapprochement bancaire', description: 'Verification des paiements' },
      { id: 'finance-expenses', name: 'Suivi des depenses', description: 'Gestion des notes de frais' },
      { id: 'finance-reports', name: 'Rapports financiers', description: 'Etablissement des bilans' },
    ],
  },
  {
    id: 'admin',
    name: 'Administration',
    icon: Settings,
    tasks: [
      { id: 'admin-scheduling', name: 'Planification reunions', description: 'Organisation des rendez-vous' },
      { id: 'admin-onboarding', name: 'Integration nouveaux employes', description: 'Processus d\'onboarding' },
      { id: 'admin-documentation', name: 'Gestion documents', description: 'Creation et mise a jour des docs' },
      { id: 'admin-approvals', name: 'Validation demandes', description: 'Workflow d\'approbation' },
    ],
  },
  {
    id: 'ops',
    name: 'Operations',
    icon: Layers,
    tasks: [
      { id: 'ops-inventory', name: 'Gestion stock', description: 'Suivi des inventaires' },
      { id: 'ops-orders', name: 'Traitement commandes', description: 'Preparation et expedition' },
      { id: 'ops-quality', name: 'Controle qualite', description: 'Verifications standards' },
      { id: 'ops-reporting', name: 'Rapports operationnels', description: 'KPIs et metriques' },
    ],
  },
]

const sectors = [
  { id: 'tech', name: 'Technologie', icon: Database },
  { id: 'retail', name: 'Commerce', icon: Store },
  { id: 'services', name: 'Services', icon: Briefcase },
  { id: 'finance', name: 'Finance', icon: CreditCard },
  { id: 'healthcare', name: 'Sante', icon: Activity },
  { id: 'manufacturing', name: 'Industrie', icon: Wrench },
  { id: 'other', name: 'Autre', icon: Globe },
]

const companySizes = [
  { id: '1-10', label: '1-10 employes', description: 'Startup en phase de demarrage' },
  { id: '11-50', label: '11-50 employes', description: 'PME en croissance' },
  { id: '51-200', label: '51-200 employes', description: 'Entreprise etablie' },
  { id: '200+', label: '200+ employes', description: 'Grande entreprise' },
]

const roles = [
  { id: 'ceo', label: 'CEO / President', icon: Award },
  { id: 'coo', label: 'COO / Directeur Operations', icon: Activity },
  { id: 'cto', label: 'CTO / Directeur Technique', icon: Database },
  { id: 'head-ops', label: 'Responsable Operations', icon: Layers },
  { id: 'daf', label: 'DAF / Directeur Financier', icon: Euro },
  { id: 'digital', label: 'Directeur Digital', icon: Globe },
  { id: 'other', label: 'Autre', icon: Users },
]

export default function DiagnosticPage() {
  const [data, setData] = useState<DiagnosticData>({
    step: 0,
    companySize: '',
    sector: '',
    role: '',
    selectedTasks: [],
    taskDetails: {},
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    earlyContactData: {
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    },
  })

  const [loading, setLoading] = useState(false)
  const [roiResults, setRoiResults] = useState<any>(null)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const totalSteps = 7
  const progress = ((data.step + 1) / totalSteps) * 100

  useEffect(() => {
    const saved = localStorage.getItem('nehosEarlyContact')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setData(prev => ({ ...prev, earlyContactData: parsed }))
      } catch (e) {
        console.error('Failed to parse saved contact data:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (data.earlyContactData) {
      localStorage.setItem('nehosEarlyContact', JSON.stringify(data.earlyContactData))
    }
  }, [data.earlyContactData])

  const nextStep = () => {
    if (canProceed()) {
      setData(prev => ({ ...prev, step: prev.step + 1 }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      toast({
        title: 'Veuillez completer les champs requis',
        variant: 'destructive',
      })
    }
  }

  const prevStep = () => {
    setData(prev => ({ ...prev, step: prev.step - 1 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToStep = (step: number) => {
    setData(prev => ({ ...prev, step }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const canProceed = (): boolean => {
    switch (data.step) {
      case 1:
        return data.companySize !== '' && data.sector !== '' && data.role !== ''
      case 2:
        return data.selectedTasks.length > 0
      case 3:
        return data.selectedTasks.every(taskId => {
          const details = data.taskDetails[taskId]
          return details && details.hoursPerWeek > 0 && details.peopleInvolved > 0
        })
      case 4:
        return roiResults !== null
      case 5:
        return roiResults !== null
      case 6:
        const hasEarlyContact = data.earlyContactData?.contactName || data.earlyContactData?.contactEmail
        const hasCurrentContact = data.contactName || data.contactEmail
        const hasValidEmail = (data.earlyContactData?.contactEmail && /\S+@\S+\.\S+/.test(data.earlyContactData.contactEmail)) ||
                                (data.contactEmail && /\S+@\S+\.\S+/.test(data.contactEmail))
        const hasValidPhone = (data.earlyContactData?.contactPhone && data.earlyContactData.contactPhone.length > 0) ||
                             (data.contactPhone && data.contactPhone.length > 0)

        return (hasEarlyContact || hasCurrentContact) && hasValidEmail && hasValidPhone
      default:
        return true
    }
  }

  const calculateROIAndProceed = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/diagnostic/calculate-roi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: data.selectedTasks,
          taskDetails: data.taskDetails,
          companySize: data.companySize,
        }),
      })

      if (!response.ok) throw new Error('Failed to calculate ROI')

      const results = await response.json()
      setRoiResults(results)

      setTimeout(() => {
        setData(prev => ({ ...prev, step: 4 }))
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Error calculating ROI:', error)
      toast({
        title: 'Erreur lors du calcul',
        description: 'Veuillez reessayer',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const sendResultsEmail = async () => {
    setLoading(true)
    try {
      const contactData = {
        contactName: data.earlyContactData?.contactName || data.contactName,
        contactEmail: data.earlyContactData?.contactEmail || data.contactEmail,
        contactPhone: data.earlyContactData?.contactPhone || data.contactPhone,
      }

      const response = await fetch('/api/diagnostic/send-results-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ...contactData,
          roiResults,
        }),
      })

      if (!response.ok) throw new Error('Failed to send results email')

      toast({
        title: 'Resultats envoyes a votre email!',
        description: 'Rapport complet transmis.',
      })
    } catch (error) {
      console.error('Error sending results email:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitLead = async () => {
    setLoading(true)
    try {
      const contactData = {
        contactName: data.earlyContactData?.contactName || data.contactName,
        contactEmail: data.earlyContactData?.contactEmail || data.contactEmail,
        contactPhone: data.earlyContactData?.contactPhone || data.contactPhone,
      }

      const response = await fetch('/api/diagnostic/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ...contactData,
          roiResults,
        }),
      })

      if (!response.ok) throw new Error('Failed to send email')

      toast({
        title: 'Diagnostic envoye avec succes!',
        description: 'Nous vous contacterons sous 24h.',
      })

      setData(prev => ({ ...prev, step: 7 }))
    } catch (error) {
      console.error('Error submitting:', error)
      toast({
        title: 'Erreur lors de l\'envoi',
        description: 'Veuillez reessayer',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (priceRange: string): string => {
    const numbers = priceRange.match(/\d+/g)
    if (!numbers) return priceRange
    return numbers.map(n => Math.round(parseInt(n) * 0.75)).join('-')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_100%,rgba(99,102,241,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_0%_100%,rgba(168,85,247,0.2),transparent)]" />
      </div>

      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Nehos Groupe
            </span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>
      </header>

      {data.step > 0 && data.step < 7 && (
        <div className="relative z-10 container mx-auto px-4 pt-4">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm text-white/60">Etape {data.step} sur 6</span>
            <span className="text-sm font-semibold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>
      )}

      <main className="relative z-10 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {data.step === 0 && (
            <motion.section
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative mb-8"
              >
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/50">
                  <Brain className="w-16 h-16 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-3xl border-2 border-dashed border-purple-400/30"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent"
              >
                Decouvrez vos pertes de temps & marge
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl"
              >
                Obtenez une estimation immediate de votre ROI potentiel grace a notre IA
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-8 mb-12"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
                  <div className="text-sm text-white/60">Entreprises analysees</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-400 mb-2">30%</div>
                  <div className="text-sm text-white/60">Economie moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">10+</div>
                  <div className="text-sm text-white/60">Annees d'experience</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  size="lg"
                  onClick={() => goToStep(1)}
                  className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-lg shadow-2xl shadow-purple-500/50"
                >
                  Demarrer le diagnostic
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.section>
          )}

          {data.step === 1 && (
            <motion.section
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Profil Entreprise</h2>
                      <p className="text-white/60">Decrivez votre structure</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-6 mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Mail className="w-8 h-8 text-purple-300" />
                        <div>
                          <h3 className="text-xl font-bold">Informations de Contact (Obligatoire)</h3>
                          <p className="text-sm text-white/70">Renseignez vos coordonnees pour que nous puissions vous contacter si necessaire</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-white mb-2">Nom complet *</Label>
                          <Input
                            placeholder="Votre nom"
                            value={data.earlyContactData?.contactName || ''}
                            onChange={(e) => setData(prev => ({
                              ...prev,
                              earlyContactData: { ...prev.earlyContactData, contactName: e.target.value }
                            }))}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>

                        <div>
                          <Label className="text-white mb-2">Email professionnel *</Label>
                          <Input
                            type="email"
                            placeholder="votre@email.com"
                            value={data.earlyContactData?.contactEmail || ''}
                            onChange={(e) => setData(prev => ({
                              ...prev,
                              earlyContactData: { ...prev.earlyContactData, contactEmail: e.target.value }
                            }))}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>

                        <div>
                          <Label className="text-white mb-2">Telephone *</Label>
                          <Input
                            type="tel"
                            placeholder="+33 6 12 34 56 78"
                            value={data.earlyContactData?.contactPhone || ''}
                            onChange={(e) => setData(prev => ({
                              ...prev,
                              earlyContactData: { ...prev.earlyContactData, contactPhone: e.target.value }
                            }))}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                      </div>

                      {data.earlyContactData && (data.earlyContactData.contactName || data.earlyContactData.contactEmail || data.earlyContactData.contactPhone) && (
                        <div className="flex items-center gap-2 text-green-300 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Informations sauvegardees pour l'envoi du rapport</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-white mb-3">Nom de l'entreprise (optionnel)</Label>
                      <Input
                        placeholder="Ex: Acme Corp"
                        value={data.companyName || ''}
                        onChange={(e) => setData(prev => ({ ...prev, companyName: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-4 text-lg">Taille de l'entreprise</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {companySizes.map(size => (
                          <motion.div
                            key={size.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              className={`cursor-pointer transition-all ${
                                data.companySize === size.id
                                  ? 'bg-purple-500/20 border-purple-500'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                              onClick={() => setData(prev => ({ ...prev, companySize: size.id }))}
                            >
                              <CardContent className="p-6">
                                <div className="font-semibold text-lg mb-1">{size.label}</div>
                                <div className="text-sm text-white/60">{size.description}</div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-white mb-4 text-lg">Secteur d'activite</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {sectors.map(sector => {
                          const Icon = sector.icon
                          return (
                            <motion.div
                              key={sector.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Card
                                className={`cursor-pointer transition-all ${
                                  data.sector === sector.id
                                    ? 'bg-purple-500/20 border-purple-500'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                                onClick={() => setData(prev => ({ ...prev, sector: sector.id }))}
                              >
                                <CardContent className="p-6 text-center">
                                  <Icon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                                  <div className="font-medium">{sector.name}</div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <Label className="text-white mb-4 text-lg">Votre role</Label>
                      <RadioGroup
                        value={data.role}
                        onValueChange={(value) => setData(prev => ({ ...prev, role: value }))}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {roles.map(role => {
                          const Icon = role.icon
                          return (
                            <div
                              key={role.id}
                              className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer ${
                                data.role === role.id
                                  ? 'bg-purple-500/20 border-purple-500'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <RadioGroupItem value={role.id} id={role.id} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Icon className="w-4 h-4 text-purple-400" />
                                  <Label htmlFor={role.id} className="font-semibold cursor-pointer">
                                    {role.label}
                                  </Label>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={() => goToStep(0)}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      Continuer
                      <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {data.step === 2 && (
            <motion.section
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Taches Repetitives</h2>
                      <p className="text-white/60">Selectionnez les taches que vous souhaitez optimiser</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {taskCategories.map(category => {
                      const Icon = category.icon
                      const selectedInCategory = category.tasks.filter(t => data.selectedTasks.includes(t.id)).length

                      return (
                        <div key={category.id}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold">{category.name}</h3>
                            {selectedInCategory > 0 && (
                              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                                {selectedInCategory} selectionnee{selectedInCategory > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.tasks.map(task => (
                              <motion.div
                                key={task.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Card
                                  className={`cursor-pointer transition-all ${
                                    data.selectedTasks.includes(task.id)
                                      ? 'bg-indigo-500/20 border-indigo-500'
                                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                                  }`}
                                  onClick={() => {
                                    setData(prev => {
                                      const isTaskSelected = prev.selectedTasks.includes(task.id)
                                      const updatedSelectedTasks = isTaskSelected
                                        ? prev.selectedTasks.filter(t => t !== task.id)
                                        : [...prev.selectedTasks, task.id]

                                      const updatedTaskDetails = { ...prev.taskDetails }
                                      if (!isTaskSelected && !prev.taskDetails[task.id]) {
                                        updatedTaskDetails[task.id] = {
                                          hoursPerWeek: 5,
                                          peopleInvolved: 1,
                                          painLevel: 3,
                                        }
                                      } else if (isTaskSelected) {
                                        delete updatedTaskDetails[task.id]
                                      }

                                      return {
                                        ...prev,
                                        selectedTasks: updatedSelectedTasks,
                                        taskDetails: updatedTaskDetails,
                                      }
                                    })
                                  }}
                                >
                                  <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                      <Checkbox
                                        id={task.id}
                                        checked={data.selectedTasks.includes(task.id)}
                                        readOnly
                                        className="mt-1"
                                      />
                                      <div className="flex-1">
                                        <Label
                                          htmlFor={task.id}
                                          className="font-semibold text-lg mb-1 cursor-pointer"
                                        >
                                          {task.name}
                                        </Label>
                                        <p className="text-sm text-white/60">{task.description}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )
                    })}

                    <div>
                      <Label className="text-white mb-3">Autre tache (optionnel)</Label>
                      <Input
                        placeholder="Decrivez une autre tache repetitive..."
                        value={data.customTask || ''}
                        onChange={(e) => setData(prev => ({ ...prev, customTask: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      Continuer
                      <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {data.step === 3 && (
            <motion.section
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Volume & Impact</h2>
                      <p className="text-white/60">Estimez le temps et les ressources pour chaque tache</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {data.selectedTasks.map(taskId => {
                      const allTasks = taskCategories.flatMap(cat => cat.tasks)
                      const task = allTasks.find(t => t.id === taskId)
                      if (!task) return null

                      const details = data.taskDetails[taskId] || {
                        hoursPerWeek: 5,
                        peopleInvolved: 1,
                        painLevel: 3,
                      }

                      return (
                        <Card key={taskId} className="bg-white/5 border-white/10">
                          <CardContent className="p-6 space-y-6">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{task.name}</h3>
                              <p className="text-sm text-white/60">{task.description}</p>
                            </div>

                            <div>
                              <div className="flex justify-between mb-3">
                                <Label className="text-white">Heures par semaine</Label>
                                <span className="text-purple-400 font-semibold">{details.hoursPerWeek}h</span>
                              </div>
                              <Slider
                                value={[details.hoursPerWeek]}
                                onValueChange={([value]) => setData(prev => ({
                                  ...prev,
                                  taskDetails: {
                                    ...prev.taskDetails,
                                    [taskId]: { ...prev.taskDetails[taskId], hoursPerWeek: value }
                                  }
                                }))}
                                min={1}
                                max={40}
                                step={1}
                                className="py-4"
                              />
                              <div className="flex justify-between text-xs text-white/40 mt-1">
                                <span>1h</span>
                                <span>20h</span>
                                <span>40h+</span>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between mb-3">
                                <Label className="text-white">Personnes impliquees</Label>
                                <span className="text-indigo-400 font-semibold">{details.peopleInvolved}</span>
                              </div>
                              <Slider
                                value={[details.peopleInvolved]}
                                onValueChange={([value]) => setData(prev => ({
                                  ...prev,
                                  taskDetails: {
                                    ...prev.taskDetails,
                                    [taskId]: { ...prev.taskDetails[taskId], peopleInvolved: value }
                                  }
                                }))}
                                min={1}
                                max={10}
                                step={1}
                                className="py-4"
                              />
                              <div className="flex justify-between text-xs text-white/40 mt-1">
                                <span>1</span>
                                <span>5</span>
                                <span>10+</span>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between mb-3">
                                <Label className="text-white">Niveau de frustration</Label>
                                <span className="text-blue-400 font-semibold">
                                  {details.painLevel <= 2 ? 'Faible' : details.painLevel <= 4 ? 'Moyen' : 'Eleve'}
                                </span>
                              </div>
                              <Slider
                                value={[details.painLevel]}
                                onValueChange={([value]) => setData(prev => ({
                                  ...prev,
                                  taskDetails: {
                                    ...prev.taskDetails,
                                    [taskId]: { ...prev.taskDetails[taskId], painLevel: value }
                                  }
                                }))}
                                min={1}
                                max={6}
                                step={1}
                                className="py-4"
                              />
                              <div className="flex justify-between text-xs text-white/40 mt-1">
                                <span>😐</span>
                                <span>😕</span>
                                <span>😫</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={calculateROIAndProceed}
                      disabled={!canProceed() || loading}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {loading ? 'Calcul en cours...' : 'Voir les resultats'}
                      <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {data.step === 4 && roiResults && (
            <motion.section
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Vos Resultats</h2>
                      <p className="text-white/60">Analyse de votre potentiel d'economie</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
                      <CardContent className="p-6 text-center">
                        <Clock className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                        <div className="text-3xl font-bold mb-2">{Math.round(roiResults.timeLostPerMonth)}h</div>
                        <div className="text-sm text-white/60">Perdues par mois</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30">
                      <CardContent className="p-6 text-center">
                        <Euro className="w-12 h-12 mx-auto mb-4 text-red-400" />
                        <div className="text-3xl font-bold mb-2">{Math.round(roiResults.costPerYear).toLocaleString()}€</div>
                        <div className="text-sm text-white/60">Cout annuel estime</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
                      <CardContent className="p-6 text-center">
                        <Zap className="w-12 h-12 mx-auto mb-4 text-green-400" />
                        <div className="text-3xl font-bold mb-2">{Math.round(roiResults.potentialSavings).toLocaleString()}€</div>
                        <div className="text-sm text-white/60">Economie potentielle</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Repartition des couts par tache</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={roiResults.taskBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                            <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                              itemStyle={{ color: 'white' }}
                              formatter={(value: any) => `${value.toLocaleString()}€`}
                            />
                            <Bar dataKey="cost" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" />
                                <stop offset="95%" stopColor="#6366f1" />
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Potentiel d'automatisation</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Automatisable', value: roiResults.automatablePercentage, color: '#22c55e' },
                                { name: 'Partiellement', value: roiResults.partiallyAutomatable, color: '#a855f7' },
                                { name: 'Complex', value: roiResults.complexPercentage, color: '#6366f1' },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {[
                                { name: 'Automatisable', value: roiResults.automatablePercentage, color: '#22c55e' },
                                { name: 'Partiellement', value: roiResults.partiallyAutomatable, color: '#a855f7' },
                                { name: 'Complex', value: roiResults.complexPercentage, color: '#6366f1' },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                              itemStyle={{ color: 'white' }}
                              formatter={(value: any) => `${value}%`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="mr-2" />
                      Retour
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        onClick={sendResultsEmail}
                        disabled={loading}
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        {loading ? 'Envoi...' : 'Recevoir par email'}
                        <Mail className="ml-2" />
                      </Button>
                      <Button
                        onClick={nextStep}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        Voir les solutions
                        <ArrowRight className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {data.step === 5 && roiResults && (
            <motion.section
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Solutions Recommandees</h2>
                      <p className="text-white/60">Plan d'action personnalise pour votre entreprise (Prix réduits de 25%)</p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    {roiResults.recommendations.map((rec: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`bg-gradient-to-br ${rec.color} border-white/10`}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                <div className="text-2xl">{rec.icon}</div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-white/20 text-white border-white/30">
                                    Priorite {rec.priority}
                                  </Badge>
                                  <Badge className="bg-white/20 text-white border-white/30">
                                    {rec.timeline}
                                  </Badge>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{rec.title}</h3>
                                <p className="text-white/80 mb-4">{rec.description}</p>
                                <div className="flex items-center gap-2 text-sm">
                                  <Euro className="w-4 h-4" />
                                  <span>{rec.costRange}</span>
                                  <span className="text-white/60 mx-2">•</span>
                                  <span className="text-green-300 font-semibold">
                                    ROI estime: {rec.roi}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                        <div>
                          <h3 className="font-semibold text-lg">Prochaines etapes</h3>
                          <p className="text-white/70">
                            Planifiez un appel avec un expert Nehos pour concreter ces recommandations
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      Planifier
                      <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {data.step === 6 && (
            <motion.section
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Finaliser votre diagnostic</h2>
                      <p className="text-white/60">Choisissez votre option et recevez votre rapport detaille</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          data.selectedOption === 'call-with-expert'
                            ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setData(prev => ({ ...prev, selectedOption: 'call-with-expert' }))}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                              <Phone className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">Call Express</h3>
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                Gratuit
                              </Badge>
                            </div>
                          </div>
                          <p className="text-white/70 mb-4">
                            Echange de 15min pour presenter vos resultats
                          </p>
                          <ul className="space-y-2 text-sm text-white/60">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Analyse de vos resultats
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Reponses a vos questions
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Orientation vers les bonnes solutions
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          data.selectedOption === 'audit-premium'
                            ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setData(prev => ({ ...prev, selectedOption: 'audit-premium' }))}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">Audit Premium</h3>
                              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                                Payant
                              </Badge>
                            </div>
                          </div>
                          <p className="text-white/70 mb-4">
                            Audit approfondi de 30-60min avec roadmap
                          </p>
                          <ul className="space-y-2 text-sm text-white/60">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-amber-400" />
                              Analyse detaillee des processus
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-amber-400" />
                              Roadmap personnalisee
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-amber-400" />
                              Devis et planning projet
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  <Card className="bg-white/5 border-white/10 mb-8">
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Label className="text-white mb-3">Nom complet *</Label>
                        <Input
                          placeholder="Jean Dupont"
                          value={data.earlyContactData?.contactName || ''}
                          onChange={(e) => setData(prev => ({
                            ...prev,
                            earlyContactData: { ...prev.earlyContactData, contactName: e.target.value }
                          }))}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div>
                        <Label className="text-white mb-3">Email professionnel *</Label>
                        <Input
                          type="email"
                          placeholder="jean@entreprise.com"
                          value={data.earlyContactData?.contactEmail || ''}
                          onChange={(e) => setData(prev => ({
                            ...prev,
                            earlyContactData: { ...prev.earlyContactData, contactEmail: e.target.value }
                          }))}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                      </div>

                      <div>
                        <Label className="text-white mb-3">Telephone *</Label>
                        <Input
                          type="tel"
                          placeholder="+33 6 12 34 56 78"
                          value={data.earlyContactData?.contactPhone || ''}
                          onChange={(e) => setData(prev => ({
                            ...prev,
                            earlyContactData: { ...prev.earlyContactData, contactPhone: e.target.value }
                          }))}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={submitLead}
                      disabled={!canProceed() || loading}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {loading ? 'Envoi en cours...' : 'Recevoir mon rapport'}
                      <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {data.step === 7 && (
            <motion.section
              key="thankyou"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white">
                <CardContent className="p-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                  >
                    <Send className="w-12 h-12 text-white" />
                  </motion.div>

                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Diagnostic envoye avec succes!
                  </h2>

                  <p className="text-xl text-white/70 mb-8">
                    Un expert Nehos vous contactera sous 24h pour discuter de vos resultats.
                  </p>

                  <Card className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-500/30 mb-8 avoid-page-break">
                    <CardContent className="p-8">
                      <h3 className="font-semibold text-lg mb-6">Resume de votre diagnostic</h3>
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div>
                          <div className="text-3xl font-bold text-purple-400 mb-2">
                            {roiResults ? Math.round(roiResults.timeLostPerMonth) : 0}h
                          </div>
                          <div className="text-sm text-white/60">Temps perdu/mois</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-red-400 mb-2">
                            {roiResults ? Math.round(roiResults.costPerYear).toLocaleString() : 0}€
                          </div>
                          <div className="text-sm text-white/60">Cout annuel</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-green-400 mb-2">
                            {roiResults ? Math.round(roiResults.potentialSavings).toLocaleString() : 0}€
                          </div>
                          <div className="text-sm text-white/60">Economie potentielle</div>
                        </div>
                      </div>

                      {roiResults && roiResults.taskBreakdown && roiResults.taskBreakdown.length > 0 && (
                        <div className="border-t border-white/10 pt-6">
                          <h4 className="font-semibold mb-4">Detail par tache</h4>
                          <div className="space-y-3">
                            {roiResults.taskBreakdown.map((task: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                                <div>
                                  <div className="font-medium">{task.name}</div>
                                  <div className="text-sm text-white/60">
                                    {task.hoursPerWeek}h/semaine • {task.yearlyHours}h/an
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">{task.cost.toLocaleString()}€</div>
                                  <div className="text-sm text-white/60">
                                    Automatisable: {task.automationPotential}%
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {roiResults && roiResults.recommendations && roiResults.recommendations.length > 0 && (
                    <Card className="bg-white/5 border-white/10 mb-8 avoid-page-break page-break">
                      <CardContent className="p-8">
                        <h3 className="font-semibold text-lg mb-6">Recommandations</h3>
                        <div className="space-y-4">
                          {roiResults.recommendations.map((rec: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                              <div className="flex items-start gap-4">
                                <div className="text-3xl">{rec.icon}</div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{rec.title}</h4>
                                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                      {rec.timeline}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-white/70 mb-3">{rec.description}</p>
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-white/60">
                                      <Euro className="w-4 h-4 inline mr-1" />
                                      {rec.costRange}
                                    </span>
                                    <span className="text-green-400 font-semibold">
                                      ROI: {rec.roi}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => window.print()}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Download className="mr-2" />
                      Telecharger le rapport
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white/60">
              <span>© 2024 Nehos Groupe</span>
              <span>•</span>
              <span>Tous droits reserves</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Mentions legales</a>
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialite</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

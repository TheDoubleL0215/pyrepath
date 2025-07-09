'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CalendarIcon, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface NewTransactionFormData {
  subject: string
  created_at: string
  amount: number
  from: string
  to: string
  note: string
}

export function NewTransactionDialog() {
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState<NewTransactionFormData>({
    subject: '',
    created_at: '',
    amount: 0,
    from: '',
    to: '',
    note: ''
  })

  const [customDate, setCustomDate] = useState<Date>(new Date()) // default today

  const handleSubmit = () => {
    const finalDate = customDate || new Date()

    if (!form.subject || !form.amount || !form.to) {
      alert('Kérlek töltsd ki az összes mezőt.')
      return
    }

    const payload = {
      subject: form.subject,
      amount: form.amount,
      to: form.to,
      created_at: finalDate.toISOString(),
    }

    console.log('Submitting:', payload)
    // Insert to Supabase here...

    setOpen(false)
  }

  // Reset form fields + date on dialog close
  useEffect(() => {
    if (!open) {
      setForm({ subject: '', created_at: new Date().toISOString(), amount: 0, to: '', from: '', note: '' })
      setCustomDate(new Date())
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus /> Add transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Új tranzakció hozzáadása</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Tárgy</Label>
            <Input

              id="subject"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="Pl. Számlafizetés"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Összeg (HUF)</Label>
            <Input
              id="amount"
              type="number"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
              placeholder="10000"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="to">Címzett</Label>
            <Input
              id="to"
              value={form.to}
              onChange={e => setForm({ ...form, to: e.target.value })}
              placeholder="Pl. OTP Bank"
            />
          </div>

          <div className="grid gap-2">
            <Label>Dátum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDate ? format(customDate, 'yyyy-MM-dd') : 'Válassz dátumot'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover">
                <Calendar
                  mode="single"
                  selected={customDate}
                  onSelect={setCustomDate}
                  required
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Mentés</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

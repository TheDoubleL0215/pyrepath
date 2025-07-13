import { Lead } from "@/const/Lead"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import React from "react"

interface LeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
  onSave: (data: {
    outcome: string
    progress: string[]
    notes: string
    callRating: number[]
  }) => Promise<void>
  isLoading: boolean
}

export function LeadDialog({
  open,
  onOpenChange,
  lead,
  onSave,
  isLoading
}: LeadDialogProps) {
  const [outcome, setOutcome] = React.useState("")
  const [progress, setProgress] = React.useState<string[]>([])
  const [notes, setNotes] = React.useState("")
  const [callRating, setCallRating] = React.useState([3])

  const outcomeOptions = [
    "Offer declined",
    "Wants further information",
    "Appointment booked",
    "Incorrect lead",
    "Unavailable at the moment"
  ]

  const progressOptions = [
    "Call Answered",
    "DM Pitched",
    "Resonation"
  ]

  const handleProgressChange = (value: string, checked: boolean) => {
    if (checked) {
      setProgress(prev => [...prev, value])
    } else {
      setProgress(prev => prev.filter(item => item !== value))
    }
  }

  const handleSave = async () => {
    if (!lead || !outcome) return

    await onSave({
      outcome,
      progress,
      notes,
      callRating
    })

    // Reset form
    setOutcome("")
    setProgress([])
    setNotes("")
    setCallRating([3])
  }

  const handleCancel = () => {
    setOutcome("")
    setProgress([])
    setNotes("")
    setCallRating([3])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lead Outcome - {lead?.Company}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Outcome Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="outcome">Outcome</Label>
            <Select value={outcome} onValueChange={setOutcome}>
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                {outcomeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Progress Checkboxes */}
          <div className="space-y-2">
            <Label>How far did it go?</Label>
            <div className="space-y-2">
              {progressOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={progress.includes(option)}
                    onCheckedChange={(checked) => handleProgressChange(option, !!checked)}
                  />
                  <Label htmlFor={option} className="text-sm font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Call Rating Slider */}
          <div className="space-y-2">
            <Label>{"How did you feel this call?"}  ({callRating[0]})</Label>
            <Slider
              value={callRating}
              onValueChange={setCallRating}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Bad</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !outcome}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
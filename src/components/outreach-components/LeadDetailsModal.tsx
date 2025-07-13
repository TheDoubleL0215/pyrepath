import { Lead } from "@/const/Lead"
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export const LeadDetailsModal = ({ lead, open, onOpenChange, onSave }: {
  lead: Lead | null,
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSave: (updatedLead: Lead) => Promise<void>
}) => {

  const [outcome, setOutcome] = React.useState("")
  const [editedLead, setEditedLead] = React.useState<Lead | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  const outcomeOptions = [
    "Offer declined",
    "Wants further information",
    "Appointment booked",
    "Incorrect lead",
    "Unavailable at the moment"
  ]

  React.useEffect(() => {
    if (lead) {
      setEditedLead({ ...lead })
      setOutcome(lead.Status || "") // sync outcome with lead.Status
    }
  }, [lead])

  if (!lead || !editedLead) return null

  const systemFields = ['Id', 'CreatedAt', 'UpdatedAt']
  const editableFields = Object.entries(editedLead).filter(([key]) =>
    !systemFields.includes(key)
  )

  const handleFieldChange = (key: string, value: string) => {
    setEditedLead(prev => prev ? { ...prev, [key]: value } : null)
    if (key === "Status") {
      setOutcome(value) // sync outcome state when Status changes
    }
  }

  const handleSave = async () => {
    if (!editedLead) return
    setIsSaving(true)
    try {
      await onSave(editedLead)
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving lead:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedLead(lead ? { ...lead } : null)
    setOutcome(lead?.Status || "")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {editableFields.map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b">
              <div className="font-medium text-sm text-muted-foreground flex items-center">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="col-span-2">
                {key.replace(/([A-Z])/g, ' $1').trim() === "Status" ? (
                  <Select
                    value={outcome}
                    onValueChange={(val) => handleFieldChange("Status", val)}
                  >
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {outcomeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    value={value !== null && value !== undefined ? String(value) : ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className="max-w-sm"
                    placeholder="Enter value..."
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { Employee } from '@/lib/interfaces/interfaces'
import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
// Import a calendar/date picker component, e.g. from 'react-date-picker' or 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'

const EmployeeEditView = ({ employee, setEdit }: { employee: Employee, setEdit: (value: boolean) => void }) => {
    const [details, setDetails] = React.useState<string>("")
    return (
        <>
            <div>
                <p className="text-sm font-semibold">Job Title</p>
                {/* <Input value={employee.jobTitle} onChange={}/> */}
            </div>

            <div>
                <p className="text-sm font-semibold">Details</p>
                <Input value={employee.details || ""} onChange={(e) => setDetails(e.target.value)}/>
            </div>

            <div>
                <p className="text-sm font-semibold">Status</p>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Sick">Sick</SelectItem>
                            <SelectItem value="Out of Office">Out of Office</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <p className="text-sm font-semibold">Hire Date</p>
                <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal text-muted-foreground")}
                                >
                                    <CalendarIcon />
                                    <span>Pick a date</span>
                                </Button>
                                <Calendar
                                    mode="single"
                                    selected={new Date(employee.hireDate)}
                                    initialFocus
                                />
                                  
                            </PopoverTrigger>
                        </Popover>
            </div>


            <div className="flex justify-between pt-4">
                <Button onClick={() => setEdit(false)}>Cancel</Button>
                {employee && <Button variant="outline">Save Edits</Button>}
            </div>
        </>
    )
}

export default EmployeeEditView
"use client";

import { Employee } from "@/lib/interfaces/interfaces";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
// Import a calendar/date picker component, e.g. from 'react-date-picker' or 'react-day-picker'
import { Calendar } from "@/components/ui/calendar";
import { updateEmployee } from "@/lib/services/employee-service";

const EmployeeEditView = ({
  employee,
  setEdit,
}: {
  employee: Employee;
  setEdit: (value: boolean) => void;
}) => {
  const [details, setDetails] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [token, setToken] = React.useState("");

  useEffect(() => {
    const handleToken = async () => {
      if (localStorage.getItem("user")) {
        setToken(await JSON.parse(localStorage.getItem("user")!).token);
      }
      if (sessionStorage.getItem("user")) {
        setToken(await JSON.parse(sessionStorage.getItem("user")!).token);
      }
    };

    handleToken();
  }, []);
  const handleEmployeeToChangeHireDate = (date: string) => {
    setEmployeeToChange({
      ...employeeToChange,
      hireDate: date,
    });
  };
  const [employeeToChange, setEmployeeToChange] =
    React.useState<Employee>(employee);
  // Date functions
  const formatDateForInput = (date: string) => {
    if (!date) return undefined;
    console.log("date", date);
    // console.log(employeeToChange);
    const [year, month, day] = date.toString().split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateFromInput = (date: Date | undefined) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleEmployee = async () => {
    try {
      const employeeWithChanges = {
        ...employeeToChange,
        details: details == "" ? employeeToChange.details : details,
        status: status == "" ? employeeToChange.status : status,
      };
      console.log("employeeWithChanges", employeeWithChanges);

      if (await updateEmployee(token, employeeWithChanges)) {
        //   await refreshEmployees();
        setEdit(false);
      }

      setEmployeeToChange({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
        details: "",
        status: "",
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <>
      <div>
        <p className="text-sm font-semibold">Job Title</p>
        {/* <Input value={employee.jobTitle} onChange={}/> */}
      </div>

      <div>
        <p className="text-sm font-semibold">Details</p>
        <Input
          placeholder={employee.details || "no details to note."}
          onChange={(e) => setDetails(e.target.value)}
        />
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
              <SelectItem value="Active" onClick={() => setStatus("Active")}>
                Active
              </SelectItem>
              <SelectItem value="Sick" onClick={() => setStatus("Sick")}>Sick</SelectItem>
              <SelectItem value="Out of Office" onClick={() => setStatus("Out of Office")}>Out of Office</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-sm font-semibold">Hire Date</p>
        {/* <Popover>
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
                        </Popover> */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal text-muted-foreground"
              )}
            >
              <CalendarIcon />
              <span>
                {new Date(employeeToChange.hireDate).toLocaleDateString()}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formatDateForInput(employeeToChange.hireDate)}
              onSelect={(date) => {
                handleEmployeeToChangeHireDate(formatDateFromInput(date));
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={() => setEdit(false)}>Cancel</Button>
        {employee && (
          <Button variant="outline" onClick={handleEmployee}>
            Save Edits
          </Button>
        )}
      </div>
    </>
  );
};

export default EmployeeEditView;

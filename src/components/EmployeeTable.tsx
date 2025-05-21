"use client";

import { Employee } from "@/lib/interfaces/interfaces";
import { deleteEmployee, getEmployees } from "@/lib/services/employee-service";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Button } from "./ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./ui/table";
import EmployeeModal from "./EmployeeModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const EmployeeTable = () => {
  const { push } = useRouter();

  // useStates
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);
  const [splicedEmployees, setSplicedEmployees] = useState<Employee[][]>([]);
  const [displayedEmployees, setDisplayedEmployees] = useState<Employee[]>([]);
  const [employeeNumber, setEmployeeNumber] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [token, setToken] = useState("");

  const [sortBy, setSortBy] = useState("name");
  const [sortByJob, setSortByJob] = useState("Job Title");

  // Function to get employees
  const handleGetEmployees = async () => {
    try {
      const result: Employee[] = await getEmployees(token);
      // const result: Employee[] | "Not Authorized" = [];
      if (result.toString() === "Not Authorized") {
        localStorage.setItem("Not Authorized", "true");
        push("/login");
      }
      setEmployeeNumber(result.length);
      setEmployees(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  // Updating sort functions
  const changeSortBy = (value: string) => {
    if (value == "name" && sortBy == "name") {
      setSortBy(`${value}-reverse`);
    } else if (value == "hire-date" && sortBy == "hire-date") {
      setSortBy(`${value}-reverse`);
    } else {
      setSortBy(value);
    }

    // if (sortByJob) {
    //   setSortByJob("");
    // }
  };

  const changeSortByJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy("job-title");

    setSortByJob(e.target.value);
  };

  // Delete employee
  const handleDeleteEmployee = async (id: number) => {
    try {
      if (await deleteEmployee(token, id)) {
        await handleGetEmployees();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // Getting the user token from storage
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

  // Fetching employees after token is set
  useEffect(() => {
    if (token !== "") {
      handleGetEmployees();
      // console.log("Employees", employees);
      // console.log("Token", token);
    }
  }, [token]);

  const handleSorting = (e: Employee[]) => {
    // console.log(sortByJob);
    console.log("unsorted", e);

    switch (sortBy) {
      case "name": {
        e.sort((a: Employee, b: Employee) => a.name.localeCompare(b.name));
        break;
      }
      case "name-reverse": {
        e.sort((a: Employee, b: Employee) => b.name.localeCompare(a.name));
        break;
      }
      case "hire-date": {
        e.sort(
          (a: Employee, b: Employee) =>
            Number(new Date(b.hireDate)) - Number(new Date(a.hireDate))
        );
        break;
      }
      case "hire-date-reverse": {
        e.sort(
          (a: Employee, b: Employee) =>
            Number(new Date(a.hireDate)) - Number(new Date(b.hireDate))
        );
        break;
      }
      default: {
        console.log(4);
        // e.sort((a: Employee, b: Employee) => a.id - b.id);
        break;
      }
    }

    if (sortByJob !== "Job Title"){
      console.log(e.filter((employee: Employee) => employee.jobTitle === sortByJob))
      // e.filter((employee: Employee) => employee.jobTitle === sortByJob)
      setSortedEmployees(e.filter((employee: Employee) => employee.jobTitle === sortByJob))
      return;
    }
    console.log("sorted", e);
    // console.log("original", employees);

    setSortedEmployees(e);
  };

  // Sorting the employees
  useEffect(() => {
    // const sortingEmployees = employees;
    // setSortedEmployees(employees);
    const editing = [...employees];
    handleSorting(editing);
    // console.log("Sorted Employees", sortedEmployees);
  }, [employees, sortBy, sortByJob]);

  useEffect(() => {
    console.log("splicing...");
    const substring = [];
    for (let i = 0; i < sortedEmployees.length; i += 3) {
      substring.push(sortedEmployees.slice(i, i + 3));
    }
    setSplicedEmployees(substring);
    console.log("spliced", substring);
    setDisplayedEmployees(substring[0]);
  }, [sortedEmployees]);

  const setPage = (page: number) => {
    setPageNumber(page + 1);
    setDisplayedEmployees(splicedEmployees[page]);
  };

  return (
    <>
      {/* Sort by - Start */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4">
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <h2 className="text-2xl font-medium text-gray-700 dark:text-white">
            Add new hire
          </h2>
          <EmployeeModal
            type="Add"
            employee={null}
            refreshEmployees={handleGetEmployees}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <p className="mr-2 text-sm text-gray-600">Sort by:</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer text-sm text-gray-600"
              >
                Name
                {
                  sortBy === "name" ? (
                    <FaCaretDown className="ml-2" />
                  ) : sortBy === "name-reverse" ? (
                    <FaCaretUp className="ml-2" />
                  ) : null
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name-reverse")}>
                Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-sm cursor-pointer text-gray-600"
              >
                Hire date
                {sortBy === "hire-date" ? (
                  <FaCaretDown className="ml-2" />
                ) : sortBy === "hire-date-reverse" ? (
                  <FaCaretUp className="ml-2" />
                ) : (
                  ""
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("hire-date")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("hire-date-reverse")}>
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-sm cursor-pointer text-gray-600"
              >
                {sortByJob}
                {/* {sortBy === "hire-date" ? (
                    <FaCaretDown className="ml-2" />
                  ) : sortBy === "hire-date-reverse" ? (
                    <FaCaretUp className="ml-2" />
                  ) : (
                    ""
                  )} */}
                <FaCaretDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortByJob("Customer Support")}>
                Customer Support
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortByJob("IT Support Specialist")}
              >
                IT Support Specialist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortByJob("Software Engineer")}>
                Software Engineer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <select
              className="ml-3 cursor-pointer hover:bg-slate-100 text-sm border rounded p-1"
              value={sortBy === "job-title" ? sortByJob : ""}
              onChange={changeSortByJob}
            >
              <option value="" disabled>
                Job Title
              </option>
              <option value="customer-support">Customer Support</option>
              <option value="IT-Support-specialist">
                IT Support Specialist
              </option>
              <option value="software-engineer">Software Engineer</option>
            </select> */}
        </div>
      </div>
      {/* Sort by - End */}

      {/* Display table - Start */}
      <h3 className="text-base ms-2">
        {`Showing ${(pageNumber - 1) * 3 + 1} - ${Math.min(
          pageNumber * 3,
          sortedEmployees.length
        )}`}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg">Employee name</TableHead>
            <TableHead className="text-lg">Job Title</TableHead>
            <TableHead className="text-lg">Date Hired</TableHead>
            <TableHead className="text-lg text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!displayedEmployees ? (
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="text-center">No Employees</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ) : (
            displayedEmployees.map((entry: Employee, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell>{entry.jobTitle}</TableCell>
                <TableCell>{entry.hireDate}</TableCell>
                <TableCell className="flex gap-3 justify-end">
                  <EmployeeModal
                    type="Edit"
                    employee={entry}
                    refreshEmployees={handleGetEmployees}
                  />
                  <Button
                    className="cursor-pointer"
                    variant="destructive"
                    onClick={() => handleDeleteEmployee(entry.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination className={sortedEmployees.length === 0 ? "hidden" : ""}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          {Array.from({ length: Math.ceil(employeeNumber / 3) }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => setPage(i)}
              >
                <p>{i + 1}</p>
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/* Display table - End */}
    </>
  );
};

export default EmployeeTable;

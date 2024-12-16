"use client";

import { Calendar, Users, CircleCheck, CreditCard } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { formatName, isDefined } from "~/lib/utils";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Switch } from "~/components/ui/switch";
import { changeStatusAction } from "../../actions";
import { useOptimistic, useState } from "react";
import { useToast } from "~/hooks/use-toast";

interface OverviewContentProps {
  status: boolean;
  userId: number;
  appointments: {
    id: number;
    patient: {
      id: number;
      firstName: string;
      lastName: string;
    };
    therapist: {
      id: number;
      firstName: string;
      lastName: string;
    };
    date: Date;
    status: "confirmed" | "pending" | "cancelled";
  }[];
  bills: {
    id: number;
    dueDate: Date;
    amount: number;
    status: "pending" | "paid";
  }[];
  patients: {
    patientId: number;
  }[];
}

export function TherapistOverview({
  userId,
  status,
  appointments,
  bills,
  patients,
}: OverviewContentProps) {
  const [active, setActive] = useState<boolean>(status);
  const { toast } = useToast();
  const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CircleCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Switch
              checked={active}
              onCheckedChange={async (checked) => {
                setActive(!active);
                const result = await changeStatusAction(userId, checked);
                if (!result.ok || !isDefined(result.result?.accepting)) {
                  toast({
                    variant: "destructive",
                    title: "An error occurred",
                    description: "Try again in a few moments",
                  });
                  setActive(active);
                }
              }}
            />
            <span className="text-sm text-muted-foreground">
              {active ? "Accepting patients" : "Not accepting patients"}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Next Appointment
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="flex flex-col">
                <p className="text-2xl font-bold">
                  {format(appointments[0]!.date, "LLLL dd, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(appointments[0]!.date, "EEEE, p")}
                </p>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                No appointments scheduled
              </span>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {bills.filter((bill) => bill.status === "pending").length}
            </span>
            <span className="text-sm text-muted-foreground">
              {" "}
              pending bill(s)
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient Count</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{patients.length}</span>
            <span className="text-sm text-muted-foreground"> patient(s)</span>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-grow flex-col items-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length > 0 &&
                  appointments.slice(0, 10).map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {format(appointment.date, "MMMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{formatName(appointment.patient)}</TableCell>
                      <TableCell>{format(appointment.date, "p")}</TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize"
                          variant={
                            appointment.status === "confirmed"
                              ? "default"
                              : "outline"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {appointments.length === 0 && (
              <span className="p-4 text-sm text-muted-foreground">
                No appointments scheduled
              </span>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href="/appointments">
              <Button variant="outline">View more</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Recent Billings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-grow flex-col items-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.length > 0 &&
                  bills.slice(0, 10).map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        {format(bill.dueDate, "MMMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{usdFormatter.format(bill.amount)}</TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize"
                          variant={
                            bill.status === "paid" ? "default" : "outline"
                          }
                        >
                          {bill.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {bills.length === 0 && (
              <span className="p-4 text-sm text-muted-foreground">
                No bills
              </span>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href="/billing">
              <Button variant="outline">View more</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

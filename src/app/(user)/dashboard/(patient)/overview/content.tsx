"use client";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  CircleUser,
  Calendar,
  FileText,
  Activity,
  PlusCircle,
  Flame,
} from "lucide-react";
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
import { formatInitials, formatName } from "~/lib/utils";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import Link from "next/link";

interface OverviewContentProps {
  therapist:
    | {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
      }
    | undefined;
  appointments: {
    id: number;
    date: Date;
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
    status: "confirmed" | "pending" | "cancelled";
  }[];
  bills: {
    id: number;
    dueDate: Date;
    amount: number;
    status: "pending" | "paid";
  }[];
  surveys: {
    id: number;
    date: Date;
    sleepTime: number;
    sleepLength: number;
    sleepQuality: number;
    waterIntake: number;
    foodIntake: number;
    foodHealthQuality: number;
    stressLevel: number;
    selfImage: number;
  }[];
}

export function PatientOverview({
  therapist,
  appointments,
  bills,
  surveys,
}: OverviewContentProps) {
  const streak = generateSurveyStreak(surveys);
  const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const nextUnpaidBill = bills.find((bill) => bill.status === "pending");
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Therapist
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {therapist ? (
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{formatInitials(therapist)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-2xl font-bold">{formatName(therapist)}</p>
                  <p className="text-sm text-muted-foreground">
                    {therapist.email}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                Select a therapist in the therapists tab
              </span>
            )}
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
            <CardTitle className="text-sm font-medium">Next Bill</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {nextUnpaidBill ? (
              <div className="flex flex-col">
                <p className="text-2xl font-bold">
                  {usdFormatter.format(bills[0]!.amount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due {format(bills[0]!.dueDate, "LLLL dd, yyyy")}
                </p>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                No unpaid bills
              </span>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Survey Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {streak > 0 ? (
              <div className="flex flex-col">
                <p className="text-2xl font-bold">
                  {streak} day{streak > 1 && "s"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {generateStreakMessage(streak)}
                </p>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                Complete a daily survey to start a streak!
              </span>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4">
        <Card className="flex h-fit w-3/5 flex-col">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-grow flex-col items-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Therapist</TableHead>
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
                      <TableCell>{formatName(appointment.therapist)}</TableCell>
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
        <Card className="flex h-fit w-2/5 flex-col">
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
function generateSurveyStreak(
  surveys: {
    id: number;
    date: Date;
    sleepTime: number;
    sleepLength: number;
    sleepQuality: number;
    waterIntake: number;
    foodIntake: number;
    foodHealthQuality: number;
    stressLevel: number;
    selfImage: number;
  }[],
) {
  let currentStreak = 0;
  let longestStreak = 0;
  let lastSurveyDate = null;

  surveys.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  for (const survey of surveys) {
    const surveyDate = new Date(survey.date);
    if (
      lastSurveyDate &&
      surveyDate.getTime() - lastSurveyDate.getTime() === 86400000
    ) {
      // 86400000 is the number of milliseconds in a day
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    lastSurveyDate = surveyDate;
  }
  return longestStreak;
}

function generateStreakMessage(streak: number) {
  if (streak === 1) {
    return `You've completed a survey! Keep going to start a streak!`;
  } else {
    return `${streak} in a row! Keep the streak alive!`;
  }
}

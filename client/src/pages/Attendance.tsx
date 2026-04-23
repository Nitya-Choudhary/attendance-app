import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Attendance() {
  const { user } = useAuth();
  const isTeacher = user?.role === "admin";

  if (isTeacher) {
    return <TeacherAttendance />;
  } else {
    return <StudentAttendance />;
  }
}

function TeacherAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [studentId, setStudentId] = useState("");
  const [status, setStatus] = useState<"present" | "absent">("present");
  const [windowCountdown, setWindowCountdown] = useState<number | null>(null);

  const enableWindowMutation = trpc.attendance.enableWindow.useMutation({
    onSuccess: () => {
      toast.success("Attendance marking window enabled for 5 minutes");
      refetchWindowStatus();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to enable attendance window");
    },
  });

  const disableWindowMutation = trpc.attendance.disableWindow.useMutation({
    onSuccess: () => {
      toast.success("Attendance marking window disabled");
      refetchWindowStatus();
      setWindowCountdown(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to disable attendance window");
    },
  });

  const { data: windowStatus, refetch: refetchWindowStatus } = trpc.attendance.getWindowStatus.useQuery(undefined, {
    refetchInterval: 1000,
  });

  const markAttendanceMutation = trpc.attendance.markAttendance.useMutation({
    onSuccess: () => {
      toast.success("Attendance marked successfully");
      setStudentId("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark attendance");
    },
  });

  const { data: records } = trpc.attendance.getAttendanceRecords.useQuery({
    subject: selectedSubject || undefined,
  });

  const handleMarkAttendance = () => {
    if (!studentId || !selectedSubject) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!windowStatus) {
      toast.error("Please enable the attendance marking window first");
      return;
    }

    markAttendanceMutation.mutate({
      studentId: parseInt(studentId),
      subject: selectedSubject,
      status,
      date: selectedDate,
    });
  };

  const handleEnableWindow = () => {
    enableWindowMutation.mutate();
  };

  const handleDisableWindow = () => {
    disableWindowMutation.mutate();
  };

  const { data: csvData } = trpc.attendance.exportCSV.useQuery({
    subject: selectedSubject || undefined,
  });

  const handleExportCSV = () => {
    if (!csvData) return;
    const element = document.createElement("a");
    const file = new Blob([csvData], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Attendance report downloaded");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Attendance Management</h1>
          <p className="text-gray-300">Mark and track student attendance</p>
          <div className="accent-line w-24 mt-4"></div>
        </div>

        {/* Attendance Window Control */}
        <Card className="card-cinematic border-2 border-secondary">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Attendance Marking Window</h2>
              {windowStatus ? (
                <div className="flex items-center gap-4">
                  <div className="text-green-400 font-semibold">
                    ✓ Window Active
                  </div>
                  <div className="text-lg font-mono text-secondary">
                    {Math.floor(windowStatus.timeRemainingSeconds / 60)}:{String(windowStatus.timeRemainingSeconds % 60).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-400">
                    ({windowStatus.timeRemainingSeconds}s remaining)
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Marking window is inactive. Enable to start marking attendance.</p>
              )}
            </div>
            <div className="flex gap-2">
              {windowStatus ? (
                <Button
                  onClick={handleDisableWindow}
                  disabled={disableWindowMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {disableWindowMutation.isPending ? "Disabling..." : "Disable Window"}
                </Button>
              ) : (
                <Button
                  onClick={handleEnableWindow}
                  disabled={enableWindowMutation.isPending}
                  className="bg-secondary hover:bg-secondary/80"
                >
                  {enableWindowMutation.isPending ? "Enabling..." : "Enable 5-Min Window"}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Mark Attendance Form */}
        <Card className="card-cinematic">
          <h2 className="text-2xl font-bold text-white mb-6">Mark Attendance</h2>
          {!windowStatus && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 font-semibold">⚠️ Attendance marking is disabled. Please enable the marking window above to mark attendance.</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-background border-border text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <Input
                type="text"
                placeholder="e.g., Mathematics"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-background border-border text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Student ID</label>
              <Input
                type="number"
                placeholder="Enter student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="bg-background border-border text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "present" | "absent")}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-white"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleMarkAttendance}
              disabled={markAttendanceMutation.isPending}
              className="bg-primary hover:bg-primary/80"
            >
              {markAttendanceMutation.isPending ? "Marking..." : "Mark Attendance"}
            </Button>
            <Button
              onClick={handleExportCSV}
              disabled={!csvData}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10"
            >
              Export CSV
            </Button>
          </div>
        </Card>

        {/* Attendance Records */}
        <Card className="card-cinematic">
          <h2 className="text-2xl font-bold text-white mb-6">Attendance Records</h2>
          {records && records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-gray-300">Student ID</th>
                    <th className="text-left py-3 px-4 text-gray-300">Subject</th>
                    <th className="text-left py-3 px-4 text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record: any) => (
                    <tr key={record.id} className="border-b border-border/50 hover:bg-background/50">
                      <td className="py-3 px-4 text-white">{record.studentId}</td>
                      <td className="py-3 px-4 text-white">{record.subject}</td>
                      <td className="py-3 px-4 text-gray-300">{record.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary/20 text-secondary'
                        }`}>
                          {record.status === 'present' ? '✓ Present' : '✗ Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No attendance records yet</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StudentAttendance() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState("");

  const { data: records } = trpc.attendance.getStudentAttendance.useQuery({
    studentId: user?.id || 0,
    subject: selectedSubject || undefined,
  });

  const { data: percentage } = trpc.attendance.calculatePercentage.useQuery({
    studentId: user?.id || 0,
    subject: selectedSubject || undefined,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Your Attendance</h1>
          <p className="text-gray-300">View your attendance records and percentage</p>
          <div className="accent-line w-24 mt-4"></div>
        </div>

        {/* Attendance Percentage */}
        <Card className="card-cinematic">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Overall Attendance</p>
              <p className="text-5xl font-bold text-gradient">{percentage || 0}%</p>
            </div>
            <div className="text-6xl">📊</div>
          </div>
        </Card>

        {/* Attendance Records */}
        <Card className="card-cinematic">
          <h2 className="text-2xl font-bold text-white mb-6">Your Records</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Subject</label>
            <Input
              type="text"
              placeholder="Leave empty to see all subjects"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-background border-border text-white"
            />
          </div>
          {records && records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-gray-300">Subject</th>
                    <th className="text-left py-3 px-4 text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record: any) => (
                    <tr key={record.id} className="border-b border-border/50 hover:bg-background/50">
                      <td className="py-3 px-4 text-white">{record.subject}</td>
                      <td className="py-3 px-4 text-gray-300">{record.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary/20 text-secondary'
                        }`}>
                          {record.status === 'present' ? '✓ Present' : '✗ Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No attendance records yet</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

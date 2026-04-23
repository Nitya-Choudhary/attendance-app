import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const isTeacher = user.role === "admin";

  if (isTeacher) {
    return <TeacherDashboard user={user} />;
  } else {
    return <StudentDashboard user={user} />;
  }
}

function TeacherDashboard({ user }: { user: any }) {
  const { data: summary, isLoading } = trpc.dashboard.getTeacherSummary.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name || "Teacher"}</h1>
          <p className="text-gray-300">Manage your classroom and monitor student progress</p>
          <div className="accent-line w-24 mt-4"></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-cinematic">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Assignments</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-4xl font-bold text-primary">{summary?.totalAssignments || 0}</p>
                )}
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </Card>

          <Card className="card-cinematic">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Pending Feedback</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-4xl font-bold text-secondary">{summary?.pendingFeedback || 0}</p>
                )}
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </Card>

          <Card className="card-cinematic">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Active Classes</p>
                <p className="text-4xl font-bold text-primary">3</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Card>
        </div>

        {/* Recent Assignments */}
        <Card className="card-cinematic">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Assignments</h2>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : summary?.recentAssignments && summary.recentAssignments.length > 0 ? (
            <div className="space-y-3">
              {summary.recentAssignments.map((assignment: any) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-white">{assignment.title}</p>
                    <p className="text-sm text-gray-400">{assignment.subject}</p>
                  </div>
                  <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No assignments yet</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StudentDashboard({ user }: { user: any }) {
  const { data: summary, isLoading } = trpc.dashboard.getStudentSummary.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name || "Student"}</h1>
          <p className="text-gray-300">Track your assignments and attendance</p>
          <div className="accent-line w-24 mt-4"></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-cinematic">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Pending Assignments</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-4xl font-bold text-secondary">{summary?.pendingAssignments || 0}</p>
                )}
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </Card>

          <Card className="card-cinematic">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Submitted</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-4xl font-bold text-primary">{summary?.submittedAssignments || 0}</p>
                )}
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </Card>

          <Card className="card-cinematic">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Feedback Sent</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-4xl font-bold text-primary">{summary?.feedbackCount || 0}</p>
                )}
              </div>
              <div className="text-4xl">💭</div>
            </div>
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card className="card-cinematic">
          <h2 className="text-2xl font-bold text-white mb-4">Your Feedback</h2>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : summary?.recentFeedback && summary.recentFeedback.length > 0 ? (
            <div className="space-y-3">
              {summary.recentFeedback.map((feedback: any) => (
                <div key={feedback.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-white">{feedback.subject}</p>
                    <p className="text-sm text-gray-400 line-clamp-1">{feedback.message}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    feedback.status === 'replied'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary/20 text-secondary'
                  }`}>
                    {feedback.status === 'replied' ? 'Replied' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No feedback yet</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

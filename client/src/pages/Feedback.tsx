import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Feedback() {
  const { user } = useAuth();
  const isTeacher = user?.role === "admin";

  if (isTeacher) {
    return <TeacherFeedback />;
  } else {
    return <StudentFeedback />;
  }
}

function StudentFeedback() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const submitMutation = trpc.feedback.submit.useMutation({
    onSuccess: () => {
      toast.success("Feedback submitted successfully");
      setSubject("");
      setMessage("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit feedback");
    },
  });

  const { data: feedbackList, refetch } = trpc.feedback.list.useQuery({
    search: searchTerm || undefined,
  });

  const handleSubmit = () => {
    if (!subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    submitMutation.mutate({
      subject,
      message,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Feedback & Suggestions</h1>
          <p className="text-gray-300">Share your feedback and suggestions with your teacher</p>
          <div className="accent-line w-24 mt-4"></div>
        </div>

        {/* Submit Feedback Form */}
        <Card className="card-cinematic">
          <h2 className="text-2xl font-bold text-white mb-6">Submit Feedback</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <Input
                type="text"
                placeholder="e.g., Course Feedback"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-background border-border text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                placeholder="Share your feedback here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-white placeholder-gray-500"
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="bg-primary hover:bg-primary/80"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </Card>

        {/* Feedback History */}
        <Card className="card-cinematic">
          <h2 className="text-2xl font-bold text-white mb-6">Your Feedback</h2>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background border-border text-white"
            />
          </div>
          {feedbackList && feedbackList.length > 0 ? (
            <div className="space-y-4">
              {feedbackList.map((item: any) => (
                <div key={item.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{item.subject}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      item.status === 'replied'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary/20 text-secondary'
                    }`}>
                      {item.status === 'replied' ? '✓ Replied' : '⏳ Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{item.message}</p>
                  {item.reply && (
                    <div className="mt-3 p-3 bg-primary/10 border-l-2 border-primary rounded">
                      <p className="text-xs text-gray-400 mb-1">Teacher's Reply:</p>
                      <p className="text-sm text-gray-200">{item.reply}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{new Date(item.createdAt).toLocaleString()}</p>
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

function TeacherFeedback() {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const replyMutation = trpc.feedback.reply.useMutation({
    onSuccess: () => {
      toast.success("Reply sent successfully");
      setReplyText("");
      setReplyingTo(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send reply");
    },
  });

  const { data: feedbackList, refetch } = trpc.feedback.list.useQuery({
    status: filterStatus || undefined,
    search: searchTerm || undefined,
  });

  const handleReply = (feedbackId: number) => {
    if (!replyText) {
      toast.error("Please enter a reply");
      return;
    }

    replyMutation.mutate({
      id: feedbackId,
      reply: replyText,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Student Feedback</h1>
          <p className="text-gray-300">Review and respond to student feedback and suggestions</p>
          <div className="accent-line w-24 mt-4"></div>
        </div>

        {/* Filters */}
        <Card className="card-cinematic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <Input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background border-border text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-white"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Feedback List */}
        <div className="space-y-4">
          {feedbackList && feedbackList.length > 0 ? (
            feedbackList.map((item: any) => (
              <Card key={item.id} className="card-cinematic">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.subject}</h3>
                    <p className="text-sm text-gray-400 mb-2">From Student ID: {item.studentId}</p>
                    <p className="text-sm text-gray-300">{item.message}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ml-4 ${
                    item.status === 'replied'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary/20 text-secondary'
                  }`}>
                    {item.status === 'replied' ? '✓ Replied' : '⏳ Pending'}
                  </span>
                </div>

                {item.reply && (
                  <div className="mb-4 p-3 bg-primary/10 border-l-2 border-primary rounded">
                    <p className="text-xs text-gray-400 mb-1">Your Reply:</p>
                    <p className="text-sm text-gray-200">{item.reply}</p>
                  </div>
                )}

                {replyingTo === item.id ? (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-white placeholder-gray-500"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleReply(item.id)}
                        disabled={replyMutation.isPending}
                        className="bg-primary hover:bg-primary/80"
                      >
                        {replyMutation.isPending ? "Sending..." : "Send Reply"}
                      </Button>
                      <Button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        variant="outline"
                        className="border-border text-gray-300 hover:bg-background/50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  item.status === 'pending' && (
                    <Button
                      onClick={() => setReplyingTo(item.id)}
                      className="bg-secondary hover:bg-secondary/80 w-full mt-4"
                    >
                      Reply to Feedback
                    </Button>
                  )
                )}

                <p className="text-xs text-gray-500 mt-4">{new Date(item.createdAt).toLocaleString()}</p>
              </Card>
            ))
          ) : (
            <p className="text-gray-400">No feedback found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

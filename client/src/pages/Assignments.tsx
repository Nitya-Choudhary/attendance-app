import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Assignments() {
  const { user } = useAuth();
  const isTeacher = user?.role === "admin";

  if (isTeacher) {
    return <TeacherAssignments />;
  } else {
    return <StudentAssignments />;
  }
}

function TeacherAssignments() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const createMutation = trpc.assignments.create.useMutation({
    onSuccess: () => {
      toast.success("Assignment created successfully");
      setTitle("");
      setDescription("");
      setSubject("");
      setDeadline("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create assignment");
    },
  });

  const { data: assignments, refetch } = trpc.assignments.list.useQuery({
    search: searchTerm || undefined,
  });

  const handleCreateAssignment = () => {
    if (!title || !description || !subject || !deadline) {
      toast.error("Please fill in all fields");
      return;
    }

    createMutation.mutate({
      title,
      description,
      subject,
      deadline,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Assignment Management</h1>
          <p className="text-gray-300">Create and manage assignments for your students</p>
          <div className="accent-line w-24 mt-4"></div>
        </div>

        {/* Create Assignment Form */}
        <Card className="card-cinematic">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <Input
                type="text"
                placeholder="Assignment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background border-border text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <Input
                type="text"
                placeholder="e.g., Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-background border-border text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-background border-border text-white"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              placeholder="Assignment description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-white placeholder-gray-500"
            />
          </div>
          <Button
            onClick={handleCreateAssignment}
            disabled={createMutation.isPending}
            className="bg-primary hover:bg-primary/80"
          >
            {createMutation.isPending ? "Creating..." : "Create Assignment"}
          </Button>
        </Card>

        {/* Assignments List */}
        <Card className="card-cinematic">
          <h2 className="text-2xl font-bold text-white mb-6">Your Assignments</h2>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background border-border text-white"
            />
          </div>
          {assignments && assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.map((assignment: any) => (
                <div key={assignment.id} className="p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{assignment.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{assignment.subject}</p>
                      <p className="text-sm text-gray-300 line-clamp-2">{assignment.description}</p>
                    </div>
                    <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      {new Date(assignment.deadline).toLocaleDateString()}
                    </span>
                  </div>
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

function StudentAssignments() {
  const { user } = useAuth();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: assignments } = trpc.assignments.list.useQuery({});

  const submitMutation = trpc.submissions.submit.useMutation({
    onSuccess: () => {
      toast.success("Assignment submitted successfully");
      setSubmissionText("");
      setSelectedFile(null);
      setSelectedAssignmentId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit assignment");
    },
  });

  const handleSubmit = async () => {
    if (!selectedAssignmentId) {
      toast.error("Please select an assignment");
      return;
    }

    if (!submissionText && !selectedFile) {
      toast.error("Please provide text or upload a file");
      return;
    }

    let fileData: any = undefined;
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData = {
          data: e.target?.result?.toString().split(',')[1],
          name: selectedFile.name,
          type: selectedFile.type,
        };

        submitMutation.mutate({
          assignmentId: selectedAssignmentId,
          submissionText: submissionText || undefined,
          file: fileData,
        });
      };
      reader.readAsDataURL(selectedFile);
    } else {
      submitMutation.mutate({
        assignmentId: selectedAssignmentId,
        submissionText: submissionText || undefined,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Assignments</h1>
          <p className="text-gray-300">View and submit your assignments</p>
          <div className="accent-line w-24 mt-4"></div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment: any) => (
              <Card key={assignment.id} className="card-cinematic">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{assignment.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{assignment.subject}</p>
                    <p className="text-sm text-gray-300 mb-4">{assignment.description}</p>
                    <p className="text-xs text-gray-400">
                      Deadline: {new Date(assignment.deadline).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ml-4 ${
                    new Date(assignment.deadline) > new Date()
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary/20 text-secondary'
                  }`}>
                    {new Date(assignment.deadline) > new Date() ? 'Active' : 'Overdue'}
                  </span>
                </div>

                {selectedAssignmentId === assignment.id && (
                  <div className="mt-6 pt-6 border-t border-border space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Submission Text</label>
                      <textarea
                        placeholder="Enter your submission text here..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Upload File (Optional)</label>
                      <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-white"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSubmit}
                        disabled={submitMutation.isPending}
                        className="bg-primary hover:bg-primary/80"
                      >
                        {submitMutation.isPending ? "Submitting..." : "Submit"}
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedAssignmentId(null);
                          setSubmissionText("");
                          setSelectedFile(null);
                        }}
                        variant="outline"
                        className="border-border text-gray-300 hover:bg-background/50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {selectedAssignmentId !== assignment.id && (
                  <Button
                    onClick={() => setSelectedAssignmentId(assignment.id)}
                    className="bg-secondary hover:bg-secondary/80 w-full"
                  >
                    Submit Assignment
                  </Button>
                )}
              </Card>
            ))
          ) : (
            <p className="text-gray-400">No assignments available</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

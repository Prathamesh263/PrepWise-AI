"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spotlight } from "@/components/ui/spotlight";
import { createInterview } from "@/lib/actions/general.action";

const InterviewForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    level: 'Junior',
    type: 'Technical',
    techstack: '',
    amount: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { success, interviewId, error: createError } = await createInterview(formData);

      if (success && interviewId) {
        setSuccess(true);
        // Show success message for 2 seconds then redirect
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);
      } else {
        setError(createError || 'Failed to create interview');
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-2xl bg-black/[0.96] relative overflow-hidden rounded-xl p-8 shadow-2xl border border-gray-800">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Create New Interview</h2>
          <p className="text-gray-300 mb-8 text-center">Fill in the details to generate a personalized interview</p>

          {error && (
            <div className="p-4 rounded-xl bg-red-900/50 border border-red-700 backdrop-blur-sm mb-6 w-full text-center">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-900/50 border border-green-700 backdrop-blur-sm mb-6 w-full text-center">
              <p className="text-green-200 text-sm">Interview created successfully! Redirecting to home page...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 w-full flex flex-col items-center">
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="role" className="text-white">Job Role</Label>
              <Input
                id="role"
                type="text"
                placeholder="e.g., Frontend Developer, Full Stack Engineer"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="bg-dark-200 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="level" className="text-white">Experience Level</Label>
              <select
                id="level"
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className="w-full bg-dark-200 border border-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="type" className="text-white">Interview Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full bg-dark-200 border border-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="techstack" className="text-white">Tech Stack (comma-separated)</Label>
              <Input
                id="techstack"
                type="text"
                placeholder="e.g., React, TypeScript, Node.js, MongoDB"
                value={formData.techstack}
                onChange={(e) => handleInputChange('techstack', e.target.value)}
                className="bg-dark-200 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="amount" className="text-white">Number of Questions</Label>
              <select
                id="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseInt(e.target.value))}
                className="w-full bg-dark-200 border border-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={7}>7 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={isLoading || success}
              className="w-full btn-primary mt-2"
            >
              {isLoading ? 'Creating Interview...' : success ? 'Interview Created!' : 'Generate Interview'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default InterviewForm;
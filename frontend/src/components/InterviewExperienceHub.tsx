import React, { useState } from "react";
import {
  ThumbsUp,
  Sparkles,
  Search,
  PlusCircle,
  Send,
  X,
} from "lucide-react";
import type { InterviewExperience, User } from "../types";

interface InterviewExperienceHubProps {
  experiences: InterviewExperience[];
  currentUser: User | null;
  onLikeExperience: (id: string) => Promise<void>;
  onPostExperience: (
    data: Partial<InterviewExperience>
  ) => Promise<void>;
}

const InterviewExperienceHub: React.FC<
  InterviewExperienceHubProps
> = ({
  experiences = [],
  currentUser,
  onLikeExperience,
  onPostExperience,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [packageCTC, setPackageCTC] = useState("");
    const [difficulty, setDifficulty] = useState("Medium");
    const [round1, setRound1] = useState("");
    const [round2, setRound2] = useState("");
    const [tips, setTips] = useState("");

    const safeExperiences = Array.isArray(experiences)
      ? experiences
      : [];

    const filteredExperiences = safeExperiences.filter(
      (experience) => {
        const search = searchTerm.toLowerCase();

        return (
          (experience.company ?? "").toLowerCase().includes(search) ||
          (experience.role ?? "").toLowerCase().includes(search) ||
          (experience.tips ?? "").toLowerCase().includes(search)
        );
      }
    );

    const closeModal = () => {
      if (submitting) return;

      setModalOpen(false);
      setError("");
    };

    const resetForm = () => {
      setCompany("");
      setRole("");
      setPackageCTC("");
      setDifficulty("Medium");
      setRound1("");
      setRound2("");
      setTips("");
    };

    const handleSubmit = async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();
      setError("");

      if (!company.trim() || !role.trim() || !tips.trim()) {
        setError(
          "Please fill in the company, role, and interview tips."
        );
        return;
      }

      const rounds = [
        {
          roundName: "Round 1",
          details: round1.trim(),
        },
        {
          roundName: "Round 2",
          details: round2.trim(),
        },
      ].filter((round) => round.details.length > 0);

      try {
        setSubmitting(true);

        await onPostExperience({
          company: company.trim(),
          role: role.trim(),
          packageCTC: packageCTC.trim(),
          difficulty,
          rounds,
          tips: tips.trim(),
        });

        resetForm();
        setModalOpen(false);
      } catch (err) {
        console.error(
          "Failed to post interview experience:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to submit your experience. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <section className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-500" size={24} />

              <h1 className="text-2xl font-bold text-gray-900">
                Interview Experiences
              </h1>
            </div>

            <p className="mt-2 text-gray-500">
              Learn from interview experiences and prepare for
              your next opportunity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <PlusCircle size={19} />
            Share Your Experience
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by company, role, or interview tips..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Experiences */}
        {filteredExperiences.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <Sparkles
              size={38}
              className="mx-auto mb-4 text-indigo-400"
            />

            <h2 className="text-lg font-semibold text-gray-800">
              {searchTerm.trim()
                ? "No Matching Experiences Found"
                : "No Interview Experiences Yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {searchTerm.trim()
                ? "Try another search term."
                : "Be the first to share your interview experience and help other students prepare."}
            </p>

            {!searchTerm.trim() && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setModalOpen(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
              >
                <PlusCircle size={18} />
                Add First Experience
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredExperiences.map((experience) => (
              <article
                key={experience._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {experience.company}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {experience.role}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                    {experience.difficulty || "Not specified"}
                  </span>
                </div>

                {experience.packageCTC && (
                  <p className="mt-3 text-sm font-semibold text-emerald-700">
                    Package: {experience.packageCTC}
                  </p>
                )}

                {/* Interview rounds */}
                {Array.isArray(experience.rounds) &&
                  experience.rounds.map((round, index) => (
                    <div
                      key={`${experience._id}-${round.roundName}-${index}`}
                      className="mt-4"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {round.roundName || `Round ${index + 1}`}
                      </h3>

                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {round.details}
                      </p>
                    </div>
                  ))}

                {experience.tips && (
                  <div className="mt-4 rounded-xl bg-amber-50 p-4">
                    <h3 className="font-semibold text-amber-900">
                      Preparation Tips
                    </h3>

                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-amber-900">
                      {experience.tips}
                    </p>
                  </div>
                )}

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      void onLikeExperience(experience._id).catch(
                        (err) => {
                          console.error(
                            "Failed to like experience:",
                            err
                          );
                        }
                      );
                    }}
                    disabled={!currentUser}
                    title={
                      currentUser
                        ? "Like this experience"
                        : "Log in to like experiences"
                    }
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ThumbsUp size={17} />
                    Helpful ({experience.likes ?? 0})
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Share Experience Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="experience-modal-title"
              className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2
                    id="experience-modal-title"
                    className="text-xl font-bold text-gray-900 sm:text-2xl"
                  >
                    Share Your Experience
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Help other students prepare for interviews.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  aria-label="Close modal"
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="experience-company"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Company *
                    </label>

                    <input
                      id="experience-company"
                      value={company}
                      onChange={(event) =>
                        setCompany(event.target.value)
                      }
                      placeholder="e.g. Google"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="experience-role"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Job Role *
                    </label>

                    <input
                      id="experience-role"
                      value={role}
                      onChange={(event) =>
                        setRole(event.target.value)
                      }
                      placeholder="e.g. Software Engineer"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="experience-package"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Package / CTC
                    </label>

                    <input
                      id="experience-package"
                      value={packageCTC}
                      onChange={(event) =>
                        setPackageCTC(event.target.value)
                      }
                      placeholder="e.g. 12 LPA"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="experience-difficulty"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Difficulty
                    </label>

                    <select
                      id="experience-difficulty"
                      value={difficulty}
                      onChange={(event) =>
                        setDifficulty(event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="experience-round1"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Round 1 Details
                  </label>

                  <textarea
                    id="experience-round1"
                    value={round1}
                    onChange={(event) =>
                      setRound1(event.target.value)
                    }
                    placeholder="Describe the first interview round..."
                    rows={3}
                    className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="experience-round2"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Round 2 Details
                  </label>

                  <textarea
                    id="experience-round2"
                    value={round2}
                    onChange={(event) =>
                      setRound2(event.target.value)
                    }
                    placeholder="Describe the second interview round..."
                    rows={3}
                    className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="experience-tips"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Interview Experience & Tips *
                  </label>

                  <textarea
                    id="experience-tips"
                    value={tips}
                    onChange={(event) =>
                      setTips(event.target.value)
                    }
                    placeholder="Describe your interview experience and share preparation tips..."
                    rows={4}
                    required
                    className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send size={17} />
                    {submitting
                      ? "Submitting..."
                      : "Submit Experience"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    );
  };

export default InterviewExperienceHub;
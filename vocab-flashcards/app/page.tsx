"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Layers,
  CalendarCheck,
  Plus,
  Search,
  RotateCcw,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";

type Word = {
  _id: string;
  word: string;
  meaning: string;
  example: string;
  reviewCount: number;
  nextReviewAt: string;
};

type Draft = {
  word: string;
  meaning: string;
  example: string;
};

const emptyDraft: Draft = {
  word: "",
  meaning: "",
  example: "",
};

type Tab = "words" | "study" | "daily";

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [tab, setTab] = useState<Tab>("words");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Used after save / delete / review to refresh the list.
  const loadWords = useCallback(async () => {
    try {
      const response = await fetch("/api/words");
      if (!response.ok) throw new Error("Could not load words.");

      const data: Word[] = await response.json();
      setWords(data);
      setError("");
    } catch {
      setError("Could not connect to the database. Check your setup.");
    }
  }, []);

  // Initial load. setState is only called after an await, never synchronously.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const response = await fetch("/api/words");
        if (!response.ok) throw new Error("Could not load words.");

        const data: Word[] = await response.json();
        if (!cancelled) setWords(data);
      } catch {
        if (!cancelled) {
          setError("Could not connect to the database. Check your setup.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  const dueWords = words.filter(
    (item) => new Date(item.nextReviewAt) <= new Date()
  );

  const visibleWords = words.filter((item) =>
    `${item.word} ${item.meaning}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const studyWords = tab === "daily" ? dueWords : words;
  const current = studyWords[index];

  async function saveWord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        editingId ? `/api/words/${editingId}` : "/api/words",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not save word.");
      }

      setDraft(emptyDraft);
      setEditingId(null);
      setShowForm(false);
      await loadWords();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save word."
      );
    }
  }

  function editWord(item: Word) {
    setDraft({
      word: item.word,
      meaning: item.meaning,
      example: item.example,
    });
    setEditingId(item._id);
    setShowForm(true);
  }

  async function deleteWord(id: string) {
    if (!window.confirm("Delete this word?")) return;

    try {
      const response = await fetch(`/api/words/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Could not delete word.");

      setIndex(0);
      setFlipped(false);
      await loadWords();
    } catch {
      setError("Could not delete word.");
    }
  }

  async function reviewWord(review: "know" | "again") {
    if (!current) return;

    try {
      const response = await fetch(`/api/words/${current._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review }),
      });

      if (!response.ok) throw new Error("Review failed.");

      setIndex(0);
      setFlipped(false);
      await loadWords();
    } catch {
      setError("Could not save your review.");
    }
  }

  function moveCard(direction: number) {
    setIndex((old) => {
      const length = studyWords.length;
      return length ? (old + direction + length) % length : 0;
    });
    setFlipped(false);
  }

  const navItems = [
    { id: "words" as const, label: "Vocabulary", icon: BookOpen },
    { id: "study" as const, label: "Study cards", icon: Layers },
    { id: "daily" as const, label: "Daily review", icon: CalendarCheck },
  ];

  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-900">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-stone-900 p-2.5 text-white">
              <BookOpen size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Vocab
              </h1>
              <p className="text-sm text-stone-500">
                Your personal word space
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setDraft(emptyDraft);
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-700"
          >
            <Plus size={17} /> Add word
          </button>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <Stat label="Total words" value={words.length} />
          <Stat label="Due today" value={dueWords.length} />
          <Stat
            label="Reviews completed"
            value={words.reduce((sum, item) => sum + item.reviewCount, 0)}
          />
        </section>

        <nav className="mt-8 flex gap-2 overflow-x-auto border-b border-stone-200 pb-3">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id);
                setIndex(0);
                setFlipped(false);
                setError("");
              }}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm ${
                tab === id
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Icon size={16} />
              {label}
              {id === "daily" && dueWords.length > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {dueWords.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {error && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-16 text-center text-stone-500">Loading vocabulary…</p>
        ) : tab === "words" ? (
          <section className="mt-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">My vocabulary</h2>
                <p className="mt-1 text-sm text-stone-500">
                  Build your word collection one word at a time.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5">
                <Search size={16} className="text-stone-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search words..."
                  className="w-36 bg-transparent text-sm outline-none sm:w-48"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
              {visibleWords.length === 0 ? (
                <p className="p-10 text-center text-sm text-stone-500">
                  {words.length ? "No matching words." : "No words yet. Add your first word to begin."}
                </p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {visibleWords.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{item.word}</h3>
                        <p className="mt-1 text-sm text-stone-600">{item.meaning}</p>
                        {item.example && (
                          <p className="mt-1 text-sm italic text-stone-400">
                            {item.example}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <IconButton label="Edit" onClick={() => editWord(item)}>
                          <Pencil size={16} />
                        </IconButton>
                        <IconButton label="Delete" onClick={() => deleteWord(item._id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="mx-auto mt-10 max-w-xl">
            <div className="mb-5 text-center">
              <h2 className="text-xl font-semibold">
                {tab === "daily" ? "Daily review" : "Study cards"}
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                {tab === "daily"
                  ? `${dueWords.length} words ready to review`
                  : `${words.length} words in your collection`}
              </p>
            </div>

            {current ? (
              <>
                <button
                  onClick={() => setFlipped((value) => !value)}
                  className="flex min-h-72 w-full flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm transition hover:border-stone-300"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
                    {flipped ? "Meaning" : "English word"}
                  </span>
                  <span className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {flipped ? current.meaning : current.word}
                  </span>
                  {flipped && current.example && (
                    <span className="mt-5 max-w-sm text-sm italic text-stone-500">
                      {current.example}
                    </span>
                  )}
                  <span className="mt-8 text-sm text-stone-400">
                    Click to {flipped ? "see the word" : "reveal the meaning"}
                  </span>
                </button>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={() => moveCard(-1)}
                    className="rounded-xl border border-stone-200 bg-white p-3"
                    aria-label="Previous card"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-stone-500">
                    {index + 1} / {studyWords.length}
                  </span>
                  <button
                    onClick={() => moveCard(1)}
                    className="rounded-xl border border-stone-200 bg-white p-3"
                    aria-label="Next card"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {tab === "daily" && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => reviewWord("again")}
                      className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium hover:bg-stone-50"
                    >
                      <RotateCcw size={16} /> Review tomorrow
                    </button>
                    <button
                      onClick={() => reviewWord("know")}
                      className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-700"
                    >
                      <Check size={16} /> I know it
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center">
                <Check className="mx-auto text-stone-400" size={30} />
                <h3 className="mt-4 font-medium">
                  {tab === "daily" ? "You're all caught up!" : "No cards yet"}
                </h3>
                <p className="mt-2 text-sm text-stone-500">
                  {tab === "daily"
                    ? "Come back when your next words are due."
                    : "Add some vocabulary to start studying."}
                </p>
              </div>
            )}
          </section>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <form
              onSubmit={saveWord}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {editingId ? "Edit word" : "Add a new word"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                  className="rounded-lg p-2 hover:bg-stone-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <Field
                  label="English word"
                  value={draft.word}
                  onChange={(value) => setDraft({ ...draft, word: value })}
                  required
                />
                <Field
                  label="Mongolian meaning"
                  value={draft.meaning}
                  onChange={(value) => setDraft({ ...draft, meaning: value })}
                  required
                />
                <Field
                  label="Example sentence (optional)"
                  value={draft.example}
                  onChange={(value) => setDraft({ ...draft, example: value })}
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-700"
              >
                {editingId ? "Save changes" : "Add word"}
              </button>
            </form>
          </div>
        )}

        <footer className="mt-16 border-t border-stone-200 py-5 text-center text-xs text-stone-400">
          Vocab · Built for daily learning
        </footer>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded-lg p-2.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-700">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={label === "English word" ? 100 : label === "Mongolian meaning" ? 500 : 1000}
        className="w-full rounded-xl border border-stone-200 px-3.5 py-3 text-sm outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-100"
      />
    </label>
  );
}
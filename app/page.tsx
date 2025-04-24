"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import addTodo from "./actions/addTodo";
import deleteTodo from "./actions/deleteTodo";
import deleteNote from "./actions/deleteNote";
import addNote from "./actions/addNote";
import { useToast } from "@/hooks/use-toast";
import { LogOutIcon, Trash2Icon } from "lucide-react";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function Home() {
  const { userId } = useParams();
  const router = useRouter();
  const [todos, setTodos] = useState<
    {
      todo_id: number;
      todo_title: string;
      notes: { note_id: number; notes_content: string }[];
    }[]
  >([]);

  const [title, setTitle] = useState("");
  const [noteContent, setNoteContent] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (!userId) return;

    async function fetchTodos() {
      const { data, error } = await supabase
        .from("todo_main_json")
        .select("json_result")
        .eq("user_id", userId);

      if (error) {
        console.error("Supabase Hata:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.warn("Supabase'den gelen veri boş.");
        return;
      }

      console.log("Supabase'den gelen JSON:", data);

      setTodos(
        data.map((row) => ({
          ...row.json_result,
          notes: row.json_result.notes || [],
        }))
      );
    }

    fetchTodos();
  }, [userId]);

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo = await addTodo(title);
    if (!newTodo) {
      console.log("Yeni todo eklenemedi!");
      return;
    }

    const { data } = await supabase
      .from("todo_main_json")
      .select("json_result");

    if (!data || data.length === 0) {
      console.warn("Supabase'den gelen veri boş.");
      return;
    }

    setTodos(
      data.map((row) => ({
        ...row.json_result,
        todos: row.json_result.todos || [],
      }))
    );
    setTitle("");
  }

  async function handleDeleteTodo(id: number) {
    const success = await deleteTodo(id);
    if (success) {
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    }
  }
  async function handleDeleteNote(noteId: number) {
    const success = await deleteNote(noteId);
    if (success) {
      setTodos(
        todos.map((todo) => ({
          ...todo,
          notes: todo.notes.filter((note) => note.note_id !== noteId),
        }))
      );
    }
  }

  async function handleAddNote(e: React.FormEvent, todoId: number) {
    e.preventDefault();

    if (!noteContent[todoId]?.trim()) return;

    const newNote = await addNote(noteContent[todoId], todoId);

    if (!newNote) {
      console.error("Yeni not eklenemedi!");
      return;
    }
    const { data } = await supabase
      .from("todo_main_json")
      .select("json_result");

    if (!data || data.length === 0) {
      console.warn("Supabase'den gelen veri boş.");
      return;
    }

    setTodos(
      data.map((row) => ({
        ...row.json_result,
        notes: row.json_result.notes || [],
      }))
    );

    setNoteContent((prev) => ({ ...prev, [todoId]: "" }));
  }

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    const response = await fetch("api/logout", {
      method: "POST",
    });
    if (response.ok) {
      toast({
        description: "Çıkış başarılı!",
        duration: 2000,
        className:
          "bg-green-600 text-white fixed top-5 right-5 z-50 w-1/10 font-bold",
      });
    }
    router.push("/login");
  }

  const { toast } = useToast();

  return (
    <div>
      <Menubar className="h-12 border-none bg-slate-700">
        <MenubarMenu>
          <MenubarTrigger className="text-black h-9 w-24  font-bold fixed right-20 bg-white">
            Kullanıcı Fullname
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-black h-9 w-16 justify-center   font-bold fixed right-2 bg-white">
            <Link onClick={handleLogout} href="/login">
              <LogOutIcon />
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      <main className="container mx-auto px-4 mb-5">
        <h1 className="bg-gray-600 text-2xl text-white font-bold text-center my-6">
          Todo List
        </h1>

        <form
          onSubmit={handleAddTodo}
          className="mb-4 flex justify-center items-center"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Todo Ekle"
            className="w-2/5 shadow appearance-none border rounded py-2 px-3 text-black font-bold text-lg"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-xl py-2 px-4 rounded ml-2"
            onClick={() => {
              toast({
                className:
                  "bg-green-600 text-white fixed top-5 right-5 z-50 w-1/10 font-bold",
                duration: 2000,
                description: "Todo başarıyla eklendi!",
              });
            }}
          >
            Ekle
          </button>
        </form>

        <ul>
          {todos.map((todo) => (
            <li
              key={todo.todo_id}
              className="flex flex-col bg-gray-800 px-4 py-2 rounded shadow my-2 font-bold text-xl "
            >
              <div className="flex justify-between items-center">
                <span className="bg-cyan-800 text-white w-80 text-center  font-bold text-2xl">
                  ⥤ {todo.todo_title} ⥢
                </span>

                <button
                  onClick={() => {
                    handleDeleteTodo(todo.todo_id);
                    toast({
                      description: "Todo başarıyla silindi!",
                      variant: "destructive",
                      className:
                        "text-white fixed top-5 right-5 z-50 w-1/10 font-bold",
                      duration: 2000,
                    });
                  }}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-3 rounded w-64"
                >
                  Todo Sil
                </button>
              </div>

              <h6 className="mt-3 mb-3 text-red-600 bg-gray-200 w-20 text-center">
                Notlar:
              </h6>

              {todo.notes && todo.notes.length > 0 ? (
                todo.notes.map((note) => (
                  <ul
                    className="list-disc ml-8 text-white flex justify-between items-center"
                    key={note.note_id}
                  >
                    <li>{note.notes_content}</li>
                    <button
                      onClick={() => {
                        handleDeleteNote(note.note_id);
                        toast({
                          description: "Not başarıyla silindi!",
                          variant: "destructive",
                          className:
                            "text-white fixed top-5 right-5 z-50 w-1/10 font-bold",
                          duration: 2000,
                        });
                      }}
                      className="bg-red-800 hover:bg-red-600 text-white font-bold py-1 px-3 rounded m-1"
                    >
                      <Trash2Icon />
                    </button>
                  </ul>
                ))
              ) : (
                <p className="text-gray-400 italic ml-8">Not Yok</p>
              )}

              <form
                onSubmit={(e) => handleAddNote(e, todo.todo_id)}
                className="mt-2 flex"
              >
                <input
                  value={noteContent[todo.todo_id] || ""}
                  onChange={(e) =>
                    setNoteContent({
                      ...noteContent,
                      [todo.todo_id]: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Not Ekle"
                  className="shadow appearance-none border rounded py-2 px-2 flex-grow text-3lg font-bold  w-1/2"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700  text-white font-bold py-1 px-4 rounded"
                  onClick={() => {
                    toast({
                      className:
                        "bg-green-600 text-white fixed top-5 right-5 z-50 w-1/10 font-bold",
                      duration: 2000,
                      description: "Not başarıyla eklendi!",
                    });
                  }}
                >
                  Ekle
                </button>
              </form>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

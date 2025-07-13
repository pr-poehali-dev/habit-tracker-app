import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import Icon from "@/components/ui/icon";
import { toast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
  lastCompleted?: string;
}



const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "Пить воду", completed: false, streak: 3 },
    { id: "2", name: "Читать книги", completed: true, streak: 7 },
    { id: "3", name: "Медитация", completed: false, streak: 2 },
  ]);
  const [newHabit, setNewHabit] = useState("");
  const [focusTime, setFocusTime] = useState(25 * 60); // 25 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );



  // Timer logic
  useEffect(() => {
    if (isTimerRunning && focusTime > 0) {
      const interval = setInterval(() => {
        setFocusTime((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            toast({
              title: "🎉 Фокус-сессия завершена!",
              description: "Отличная работа!",
            });
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    } else if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerRunning, focusTime]);

  const addHabit = () => {
    if (newHabit.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit.trim(),
        completed: false,
        streak: 0,
      };
      setHabits([...habits, habit]);
      setNewHabit("");
      toast({ title: "✅ Привычка добавлена!", description: newHabit });
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const newCompleted = !habit.completed;
          const newStreak = newCompleted
            ? habit.streak + 1
            : Math.max(0, habit.streak - 1);



          return { ...habit, completed: newCompleted, streak: newStreak };
        }
        return habit;
      }),
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id));
    toast({ title: "🗑️ Привычка удалена" });
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    toast({
      title: "⏰ Фокус-сессия начата!",
      description: "25 минут концентрации",
    });
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setFocusTime(25 * 60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Мой дневник привычек
          </h1>
          <p className="text-slate-600">Следи за собой каждый день</p>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
            {/* Add Habit Form */}
            <Card className="hover:shadow-md transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Plus" size={20} className="text-indigo-600" />
                  Добавить привычку
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="Например: пить воду, читать, гулять..."
                    onKeyPress={(e) => e.key === "Enter" && addHabit()}
                    className="flex-1 focus:ring-2 focus:ring-indigo-300 transition-all"
                    title="Нажмите Enter для добавления"
                  />
                  <Button
                    onClick={addHabit}
                    className="bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
                    title="Добавить привычку"
                  >
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Habits List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon
                    name="CheckSquare"
                    size={20}
                    className="text-emerald-600"
                  />
                  Мои привычки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-300 hover:shadow-md transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3">
                        <Button
                          variant={habit.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleHabit(habit.id)}
                          className={`transition-all duration-200 hover:scale-110 ${
                            habit.completed
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "hover:border-emerald-400"
                          }`}
                          title={habit.completed ? "Отменить выполнение" : "Отметить выполненной"}
                        >
                          <Icon
                            name={habit.completed ? "Check" : "Circle"}
                            size={16}
                          />
                        </Button>
                        <div>
                          <span
                            className={`font-medium ${habit.completed ? "text-emerald-700 line-through" : "text-slate-700"}`}
                          >
                            {habit.name}
                          </span>
                          {habit.streak > 0 && (
                            <div className="flex items-center gap-1 mt-1 animate-pulse">
                              <Icon
                                name="Flame"
                                size={14}
                                className="text-orange-500"
                              />
                              <span className="text-sm text-orange-600 font-medium">
                                {habit.streak}{" "}
                                {habit.streak === 1
                                  ? "день"
                                  : habit.streak < 5
                                    ? "дня"
                                    : "дней"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteHabit(habit.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 hover:scale-110"
                        title="Удалить привычку"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ))}
                  {habits.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Icon
                        name="ListTodo"
                        size={48}
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p>Добавьте свою первую привычку!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Stats and Timer Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Progress Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart3" size={20} className="text-blue-600" />
                    Статистика
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Выполнено сегодня</span>
                        <span className="font-medium">
                          {completedCount} / {totalCount}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    {progressPercentage === 100 && totalCount > 0 && (
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <Icon
                          name="Trophy"
                          size={24}
                          className="mx-auto text-emerald-600 mb-1"
                        />
                        <p className="text-emerald-700 font-medium text-sm">
                          Все привычки выполнены! 🎉
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Focus Timer */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Timer" size={20} className="text-purple-600" />
                    Фокус-сессия
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-mono font-bold text-purple-600">
                      {formatTime(focusTime)}
                    </div>
                    <div className="flex gap-2">
                      {!isTimerRunning ? (
                        <Button
                          onClick={startTimer}
                          className="bg-purple-600 hover:bg-purple-700 flex-1 hover:scale-105 transition-all duration-200"
                          title="Начать 25-минутную фокус-сессию"
                        >
                          <Icon name="Play" size={16} className="mr-1" />
                          Начать
                        </Button>
                      ) : (
                        <Button
                          onClick={stopTimer}
                          variant="outline"
                          className="flex-1 hover:scale-105 transition-all duration-200"
                          title="Остановить таймер"
                        >
                          <Icon name="Square" size={16} className="mr-1" />
                          Стоп
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="glass-card rounded-xl p-4 shadow-card">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDateChange(subDays(date, 1))}
          className="h-10 w-10 rounded-full hover:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 rounded-lg px-4 py-2 transition-colors hover:bg-muted">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-muted-foreground">Data</p>
                <p className="text-sm font-semibold">{capitalizedDate}</p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  onDateChange(newDate);
                  setIsOpen(false);
                }
              }}
              locale={ptBR}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDateChange(addDays(date, 1))}
          className="h-10 w-10 rounded-full hover:bg-muted"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";

type Field<T> =
  | {
      type: "text";
      name: keyof T;
      label: string;
      placeholder?: string;
    }
  | {
      type: "textarea";
      name: keyof T;
      label: string;
      placeholder?: string;
      rows?: number;
    }
  | {
      type: "select";
      name: keyof T;
      label: string;
      placeholder?: string;
      options: { label: string; value: string }[];
    };

type Props<T extends object> = {
  open: boolean;
  title: string;
  description?: string;
  fields: Field<T>[];
  values: Partial<T>;
  onChange: (data: Partial<T>) => void;
  onClose: () => void;
  onSave: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClassName?: string;
  loading?: boolean;
  confirmDisabled?: boolean;
};

const FormModal = <T extends object>({
  open,
  title,
  description,
  fields,
  values,
  onChange,
  onClose,
  onSave,
  confirmText = "Save",
  cancelText = "Cancel",
  confirmButtonClassName,
  loading = false,
  confirmDisabled = false,
}: Props<T>) => (
  <Dialog
    open={open}
    onOpenChange={(isOpen) => {
      if (loading) return;
      if (!isOpen) onClose();
    }}
  >
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {fields.map((field) => {
          const value = (values as Record<string, unknown>)[
            field.name as string
          ] as string | undefined;

          if (field.type === "textarea") {
            return (
              <div className="grid gap-2" key={String(field.name)}>
                <Label htmlFor={String(field.name)}>{field.label}</Label>
                <Textarea
                  id={String(field.name)}
                  value={value ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...values,
                      [field.name]: e.target.value,
                    } as Partial<T>)
                  }
                  placeholder={field.placeholder}
                  rows={field.rows ?? 6}
                  className="focus-visible:border-blue-500 focus-visible:ring-blue-600/40 focus-visible:ring-2"
                />
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div className="grid gap-2" key={String(field.name)}>
                <Label htmlFor={String(field.name)}>{field.label}</Label>
                <Select
                  value={value ?? ""}
                  onValueChange={(val) =>
                    onChange({
                      ...values,
                      [field.name]: val,
                    } as Partial<T>)
                  }
                >
                  <SelectTrigger className="focus-visible:border-blue-500 focus-visible:ring-blue-600/40 focus-visible:ring-2">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          return (
            <div className="grid gap-2" key={String(field.name)}>
              <Label htmlFor={String(field.name)}>{field.label}</Label>
              <Input
                id={String(field.name)}
                value={value ?? ""}
                onChange={(e) =>
                  onChange({
                    ...values,
                    [field.name]: e.target.value,
                  } as Partial<T>)
                }
                placeholder={field.placeholder}
                className="focus-visible:border-blue-500 focus-visible:ring-blue-600/40 focus-visible:ring-2"
              />
            </div>
          );
        })}
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
          className="cursor-pointer"
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onSave}
          disabled={loading || confirmDisabled}
          className={cn(
            confirmButtonClassName ??
              "bg-blue-600 hover:bg-blue-700 text-white",
            "cursor-pointer"
          )}
        >
          {loading ? "Loading..." : confirmText}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default FormModal;

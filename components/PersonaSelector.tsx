"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PersonaSelectorProps = {
  selectedPersona: string;
  setSelectedPersona: React.Dispatch<
    React.SetStateAction<string>
  >;
};
export default function PersonaSelector({
selectedPersona,
setSelectedPersona,
}: PersonaSelectorProps) {
  return (
    <div>
      <p className="mb-2 font-medium">Choose Persona</p>

     <Select
  value={selectedPersona}
 onValueChange={(value) => {
  if (value) {
    setSelectedPersona(value);
  }
}}
>
        <SelectTrigger>
          <SelectValue placeholder="Select a Persona" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="hitesh">
            Hitesh Choudhary
          </SelectItem>

          <SelectItem value="piyush">
            Piyush Garg
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
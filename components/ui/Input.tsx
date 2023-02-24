
import { IInputProps } from "native-base/lib/typescript/components/primitives/Input/types";
import { Input } from "native-base";

export default function MInput(props: IInputProps) {
    return <Input size="md" p="4" _focus={{ bg: "white" }} borderColor="white" bg="white" borderRadius="xl" {...props} />
}
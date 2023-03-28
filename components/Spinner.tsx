import React from "react";
import { Center, Spinner as MSpinner } from "native-base";
interface SpinnerProps {
  accessibilityLabel?: string;
  size?: "sm" | "lg";
}

const Spinner = ({
  accessibilityLabel = "label",
  size = "lg",
}: SpinnerProps) => {
  return (
    <Center flex={1}>
      <MSpinner
        color="primary.300"
        accessibilityLabel={accessibilityLabel}
        size={size}
      />
    </Center>
  );
};

export default Spinner;

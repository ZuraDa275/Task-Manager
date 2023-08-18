import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Variants() {
  return (
    <Stack spacing={1}>
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
      {/* For other variants, adjust the size with `width` and `height` */}

      <Skeleton
        variant="rectangular"
        width={400}
        height={200}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={400}
        height={200}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={400}
        height={200}
        animation="wave"
      />
    </Stack>
  );
}

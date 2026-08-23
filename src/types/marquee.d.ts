import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          behavior?: "" | "scroll" | "slide" | "alternate";
          direction?: "" | "left" | "right" | "up" | "down";
        },
        HTMLElement
      >;
    }
  }
}

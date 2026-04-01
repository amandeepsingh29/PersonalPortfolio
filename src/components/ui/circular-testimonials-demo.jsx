import React from "react";
import { CircularTestimonials } from "@/components/ui/circular-testimonials";

const testimonials = [
  {
    quote:
      "I was impressed by the food! And I could really tell that they use high-quality ingredients. The staff was friendly and attentive. I'll definitely be back for more!",
    name: "Tamar Mendelson",
    designation: "Restaurant Critic",
    src:
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop",
  },
  {
    quote:
      "This place exceeded all expectations! The atmosphere is inviting, and the staff truly goes above and beyond. I'll keep returning for more exceptional dining experience.",
    name: "Joe Charlescraft",
    designation: "Frequent Visitor",
    src:
      "https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop",
  },
  {
    quote:
      "Shining Yam is a hidden gem! The impeccable service and overall attention to detail created a memorable experience. I highly recommend it!",
    name: "Martina Edelweist",
    designation: "Satisfied Customer",
    src:
      "https://images.unsplash.com/photo-1524267213992-b76e8577d046?q=80&w=1368&auto=format&fit=crop",
  },
];

export function CircularTestimonialsDemo() {
  return (
    <section className="space-y-10">
      <div className="flex min-h-[300px] flex-wrap items-center justify-center rounded-lg bg-[#f7f7fa] p-8 md:p-16">
        <div className="relative flex items-center justify-center" style={{ maxWidth: "1456px" }}>
          <CircularTestimonials
            testimonials={testimonials}
            autoplay={true}
            colors={{
              name: "#0a0a0a",
              designation: "#454545",
              testimony: "#171717",
              arrowBackground: "#141414",
              arrowForeground: "#f1f1f7",
              arrowHoverBackground: "#00A6FB",
            }}
            fontSizes={{
              name: "28px",
              designation: "20px",
              quote: "20px",
            }}
          />
        </div>
      </div>

      <div className="flex min-h-[300px] flex-wrap items-center justify-center rounded-lg bg-[#060507] p-8 md:p-16">
        <div className="relative flex items-center justify-center" style={{ maxWidth: "1024px" }}>
          <CircularTestimonials
            testimonials={testimonials}
            autoplay={true}
            colors={{
              name: "#f7f7ff",
              designation: "#e1e1e1",
              testimony: "#f1f1f7",
              arrowBackground: "#0582CA",
              arrowForeground: "#141414",
              arrowHoverBackground: "#f7f7ff",
            }}
            fontSizes={{
              name: "28px",
              designation: "20px",
              quote: "20px",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default CircularTestimonialsDemo;

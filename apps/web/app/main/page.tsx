// import { Button } from "@workspace/ui/components/button"

// export default function Page() {
  
//   return (
//     <div className="flex items-center justify-center min-h-svh bg-[#297FFF] relative">
//       <div className="flex flex-row items-center justify-center gap-4">
//         <div className="">
//           <h1 className="text-[50px] font-bold">Zacznij sprzedawać bez ryzyka i bez formalności</h1>
//           <p className="text-[22px]">siedlisko łączy hurtownie i sprzedawców w jednym miejscu. Dodawaj produkty, sprzedawaj w dropshippingu lub tradycyjnie — bez zakładania firmy i bez skomplikowanych integracji.</p>
//           <Button size="sm">Zacznij działać z nami</Button>
//         </div>
//         <div className="">
//           <div className="rounded-[50px] bg-white w-[200px] h-[200px]">

//           </div>
//         </div>
//       </div>
//         <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
//           <svg className="block w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
//             <path fill="#ffffff" d="M0,192L48,176C96,160,192,128,288,112C384,96,480,96,576,122.7C672,149,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
//           </svg>
//         </div>
//     </div>
//   )
// }




// apps/web/src/app/page.tsx
import Image from "next/image";
// Jeśli używasz shadcn Button z paczki UI, odkomentuj i popraw import pod swój setup:
// import { Button } from "@workspace/ui/components/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#297FFF] text-white">
        {/* FALA NA DOLE */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 320"
          aria-hidden="true"
        >
          <path
            fill="#ffffff"
            d="M0,256L80,240C160,224,320,192,480,176C640,160,800,160,960,176C1120,192,1280,224,1360,240L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>

        {/* CONTENT WRAPPER */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-1 flex-col px-4 pb-28 pt-24 md:flex-row md:items-center md:justify-between md:pb-32 md:pt-28">
          {/* LEWA KOLUMNA – TEKST */}
          <div className="order-1 max-w-xl md:order-1">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide">
              Platforma dla hurtowni i sprzedawców
            </span>

            <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Zacznij sprzedawać
              <br />
              bez ryzyka i formalności
            </h1>

            <p className="mt-6 max-w-lg text-base text-white/90 sm:text-lg">
              siedlisko łączy hurtownie i sprzedawców w jednym miejscu. Dodawaj produkty,
              integruj sklepy i sprzedawaj w modelu dropshipping lub tradycyjnym — bez
              zakładania firmy i skomplikowanych integracji.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Jeśli masz shadcn Button, użyj go zamiast <button> */}
              {/* <Button size="lg" className="bg-white text-[#297FFF] hover:bg-white/90">
                Zacznij działać z nami
              </Button> */}
              <button className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#297FFF] shadow-md transition hover:bg-white/90">
                Zacznij działać z nami
              </button>

              <button className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Dowiedz się więcej
              </button>
            </div>

            <p className="mt-4 text-xs text-white/70 sm:text-sm">
              Bez opłat na start. Płacisz dopiero, gdy zaczniesz sprzedawać.
            </p>
          </div>

          {/* PRAWA KOLUMNA – MOCKUP / OBRAZ */}
          <div className="order-2 mt-10 flex w-full justify-center md:order-2 md:mt-0 md:w-1/2">
            <div className="relative h-100 w-full rounded-3xl bg-white/95 p-4 shadow-xl shadow-black/20 md:h-150">
              {/* Placeholder mockupu – podmień src na swój screenshot panelu */}
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-50">
                <Image
                  src="/images/siedlisko-dashboard.png"
                  alt="Panel siedlisko – przykładowy widok produktów i zamówień"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Małe "bąbelki" dekoracyjne */}
              <div className="pointer-events-none absolute -left-6 -top-6 h-10 w-10 rounded-2xl bg-white/20" />
              <div className="pointer-events-none absolute -right-4 bottom-6 h-6 w-6 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


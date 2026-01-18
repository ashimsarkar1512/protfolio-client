// export default function Main() {
//   const skills = [
//     { name: "React", desc: "Component-based UI development" },
//     { name: "Next.js", desc: "SSR, SSG & App Router" },
//     { name: "TypeScript", desc: "Type-safe scalable apps" },
//     { name: "Tailwind CSS", desc: "Utility-first styling" },
//     { name: "Three.js", desc: "3D & WebGL experiences" },
//     { name: "Framer Motion", desc: "Smooth UI animations" },
//     { name: "Node.js", desc: "Backend & APIs" },
//     { name: "MongoDB", desc: "NoSQL database" },
//   ]

//   return (
//     <main className="relative z-10 space-y-40">
//       {/* HERO */}
//       <section className="min-h-screen flex items-center justify-center">
//         <div className="bg-white/5 backdrop-blur-2xl rounded-3xl px-16 py-20 max-w-4xl text-center">
//           <h1 className=" text-yellow-300 font-extrabold tracking-tight">Creative Frontend Developer</h1>
//           <p className="mt-6 text-xl text-white/70">
//             I build modern web experiences with{" "}
//             <span className="text-white font-medium">React, Next.js & Three.js</span>
//           </p>
//           <div className="mt-10 flex gap-6 justify-center">
//             <button className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition">
//               View Projects
//             </button>
//             <button className="px-8 py-3 rounded-full border border-white/30 hover:bg-white/10 transition">
//               Contact Me
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ABOUT */}
//       <section className="min-h-screen flex items-center justify-center">
//         <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-16 max-w-3xl text-center">
//           <h2 className="text-4xl font-semibold mb-6">About Me</h2>
//           <p className="text-white/70 leading-relaxed text-lg">
//             I’m a passionate frontend developer focused on creating visually engaging and user-friendly interfaces. I
//             enjoy combining clean design with smooth animations.
//           </p>
//         </div>
//       </section>

//       {/* SKILLS */}
//       <section className="min-h-screen flex items-center justify-center">
//         <div className="max-w-6xl w-full px-6">
//           <h2 className="text-4xl font-semibold text-center mb-16">Skills & Tools</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//             {skills.map((skill) => (
//               <div
//                 key={skill.name}
//                 className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300"
//               >
//                 <h3 className="text-xl font-semibold mb-3">{skill.name}</h3>
//                 <p className="text-sm text-white/70">{skill.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }







import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className=" flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
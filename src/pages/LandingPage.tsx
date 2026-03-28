import { motion, type Variants } from 'framer-motion'
import { ShieldCheck, GraduationCap, Users, ArrowRight, Star, CheckCircle2, LogIn, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 } as any
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-48px)] bg-background">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[800px] w-full px-6 pt-16 md:pt-28 pb-12 text-center flex flex-col items-center space-y-10"
      >
        <motion.div variants={itemVariants} className="space-y-5">
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight leading-[1.1]">
            Turn Your Ideas Into <br />
            <span className="text-primary italic">Real Projects 🚀</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-[#000000e6]">
            Find Teammates. Build Faster. Get Recognized.
          </h2>
          <p className="text-lg text-[#666666] max-w-[580px] mx-auto leading-relaxed">
            Join students building real-world projects, not just assignments. 
            Bridge the gap between theory and impact.
          </p>
        </motion.div>

        {/* Primary CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-none sm:w-auto">
          <Link
            to="/auth"
            state={{ mode: 'signup' }}
            className="li-button-primary h-14 px-10 text-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group w-full sm:w-auto"
          >
            <UserPlus className="h-5 w-5" />
            Join for Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/auth"
            state={{ mode: 'login' }}
            className="li-button-secondary h-14 px-10 text-lg font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </Link>
        </motion.div>

        {/* Trust Line */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-[#666666] font-medium">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>No experience needed · No credit card required · Free forever</span>
        </motion.div>

        {/* Social Proof Bar */}
        <motion.div 
          variants={itemVariants} 
          className="pt-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
        >
          <div className="flex -space-x-3">
            {['JD', 'AK', 'MS', 'RK'].map((initials, i) => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-neutral-200 shadow-sm flex items-center justify-center text-xs font-black text-[#666666]">
                {initials}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center md:items-start gap-1">
             <div className="flex items-center gap-0.5 text-yellow-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                <span className="text-xs font-bold text-black ml-1">4.9 / 5</span>
             </div>
             <p className="text-sm font-semibold text-black">
               10,000+ students already building projects
             </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Divider */}
      <div className="w-full max-w-[1128px] px-4 lg:px-0">
        <div className="h-px bg-border" />
      </div>

      {/* Benefits - How It Works */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
        className="max-w-[1128px] w-full px-4 lg:px-0 py-20 space-y-12"
      >
        <motion.div variants={itemVariants} className="text-center space-y-3">
          <h2 className="text-3xl font-black text-black">Why students choose Projecxy</h2>
          <p className="text-[#666666]">Built for the next generation of innovators.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="li-card p-8 flex flex-col items-center text-center space-y-5 group hover:border-primary/30 cursor-default"
            >
              <div className="p-4 bg-[#EDF3F8] rounded-2xl text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                <benefit.icon className="h-8 w-8" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-black">{benefit.title}</h3>
                <p className="text-[#666666] leading-relaxed text-sm">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonial */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full bg-white border-y border-border py-16 px-4"
      >
         <div className="max-w-[700px] mx-auto text-center space-y-4">
            <div className="flex justify-center gap-0.5 text-yellow-400 mb-2">
               {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-current" />)}
            </div>
            <p className="text-xl font-semibold text-black leading-relaxed">
               "Projecxy changed how I approach my engineering degree. I'm now working with a team across 3 universities on a real drone project."
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
               <div className="h-10 w-10 bg-neutral-200 rounded-full flex items-center justify-center font-black text-[#666666]">AC</div>
               <div className="text-left">
                  <p className="font-bold text-sm text-black">Alex Chen</p>
                  <p className="text-xs text-[#666666]">Senior Engineering Student @ MIT</p>
               </div>
            </div>
         </div>
      </motion.section>

      {/* Final CTA Banner */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 px-6 text-center max-w-2xl mx-auto space-y-8"
      >
         <h2 className="text-3xl font-black text-black">Ready to start building your legacy?</h2>
         <Link to="/auth" state={{ mode: 'signup' }} className="li-button-primary h-14 px-12 text-xl font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2 mx-auto group w-fit">
            Get Started — It's Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
         </Link>
      </motion.section>
    </div>
  )
}

const benefits = [
  {
    title: 'Protect Your Ideas',
    description: 'Our Originality Guard uses AI-driven semantic analysis to verify uniqueness and help you document your leadership legally.',
    icon: ShieldCheck,
  },
  {
    title: 'Get Expert Guidance',
    description: 'Connect with verified faculty and industry mentors who give you real-time feedback on your project milestones.',
    icon: GraduationCap,
  },
  {
    title: 'Find Your Perfect Team',
    description: 'Precision matching finds members whose skills complement your vision — exactly when and where you need them.',
    icon: Users,
  },
]

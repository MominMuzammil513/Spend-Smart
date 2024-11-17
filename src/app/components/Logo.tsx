"use client"
import { motion } from "framer-motion"
import { DollarSign, Percent, TrendingUp, PiggyBank } from "lucide-react"
import Link from "next/link"
const Logo = ({className, logoClassName}:{className:string, logoClassName:string}) => {
    const icons = [DollarSign, Percent, TrendingUp, PiggyBank]
    return (
        <>
            <Link href="#" className={className}>
          <div className="relative w-6 h-5">
            {icons.map((Icon, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [0, 0, 180],
                }}
                transition={{
                  duration: 5, // Increased duration
                  repeat: Infinity,
                  delay: index * 1.5, // Increased delay
                  ease: "easeInOut",
                }}
              >
                <Icon className={logoClassName} />
              </motion.div>
            ))}
          </div>
          <motion.div
            className="font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="inline-block"
              animate={{
                color: ["#2196F3", "#4CAF50", "#FFC107", "#F44336"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Spend
            </motion.span>
            <motion.span
              className="inline-block ml-1"
              animate={{
                color: ["#4CAF50", "#FFC107", "#F44336", "#2196F3"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Smart
            </motion.span>
          </motion.div>
          <div
            className="fixed hidden group-hover:block z-50 top-full left-0 mt-1 p-2 text-sm bg-transparent border-2 dark:border-zinc-300  focus:ring-0 focus:border-none dark:bg-zinc-900 rounded-full"
          >
            Manage Your Finances Wisely
          </div>
        </Link>
        </>
    )
}
export default Logo
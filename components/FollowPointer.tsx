import { stringToColor } from "@/lib/stringToColor"
import { motion } from "framer-motion"

function FollowPointer({
  x,
  y,
  info,
}: {
  x: number
  y: number
  info: {
    name: string
    email: string
    avatar: string
  }
}) {
  const color = stringToColor(info.email || "default")

  return (
    <>
      {/* Windows-style cursor triangle */}
      <motion.div
        style={{
          position: "fixed",
          top: y,
          left: x,
          width: 12,
          height: 12,
          background: color,
          clipPath: "polygon(0 0, 100% 50%, 40% 60%, 60% 100%, 50% 60%, 0 100%)",
          transform: "rotate(45deg)",
          zIndex: 999,
          pointerEvents: "none",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Info bubble following pointer */}
      <motion.div
        style={{
          position: "fixed",
          top: y + 20,
          left: x + 20,
          background: color,
          padding: "8px 12px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          color: "#fff",
          zIndex: 1000,
          pointerEvents: "none",
          minWidth: 160,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div style={{ fontWeight: "bold", fontSize: 14 }}>
          {info.name || info.email}
        </motion.div>
      </motion.div>
    </>
  )
}

export default FollowPointer

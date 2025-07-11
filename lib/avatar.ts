export function getUserInitials(name: string): string {
  if (!name || name.trim() === "") return "U"
  
  const names = name.trim().split(/\s+/).filter(n => n.length > 0)
  
  if (names.length === 0) return "U"
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

export function generateAvatarUrl(name: string, size: number = 100): string {
  const initials = getUserInitials(name)
  const colors = [
    "bg-blue-500",
    "bg-green-500", 
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500"
  ]
  
  // Use name to generate consistent color
  const colorIndex = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  const color = colors[colorIndex]
  
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${color.replace("bg-", "#")}" rx="50%"/><text x="50%" y="50%" font-family="system-ui" font-size="${size * 0.4}" font-weight="600" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`
}

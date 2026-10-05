import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

type Room = { id: string; name: string; job: string; color: string; plate: boolean };

const ROOMS: { test: (path: string) => boolean; room: Room }[] = [
  { test: (p) => p.startsWith("/world/makcikgpt") || p.startsWith("/makcikgpt"), room: { id: "civic", name: "Civic", job: "The column, in her voice.", color: "#D9A62E", plate: true } },
  { test: (p) => p.startsWith("/earth"), room: { id: "earth", name: "Earth", job: "Reads the ground.", color: "#3DDC97", plate: true } },
  { test: (p) => p.startsWith("/words") || p.startsWith("/writing") || p.startsWith("/essays") || p.startsWith("/read"), room: { id: "words", name: "Writing", job: "Essays, in his voice.", color: "#E4C39A", plate: true } },
  { test: (p) => p.startsWith("/world"), room: { id: "world", name: "The newsroom", job: "What is happening outside.", color: "#F2B705", plate: true } },
  { test: (p) => p.startsWith("/institution"), room: { id: "institution", name: "Briefing", job: "Work together. Inspect first.", color: "#C9A227", plate: true } },
  { test: (p) => p.startsWith("/vitals") || p.startsWith("/propa"), room: { id: "vitals", name: "Research", job: "The barrels, counted in the open.", color: "#4AA8FF", plate: true } },
  { test: (p) => p.startsWith("/discovery"), room: { id: "discovery", name: "The map", job: "Nine rooms, one teacher each.", color: "#7EE0C6", plate: true } },
  { test: (p) => p.startsWith("/human"), room: { id: "human", name: "For agents", job: "Read this before you act.", color: "#7AA2FF", plate: true } },
  { test: (p) => p.startsWith("/gold"), room: { id: "gold", name: "Gold", job: "The metal, on one screen.", color: "#F0C840", plate: true } },
  { test: (p) => p.startsWith("/oil"), room: { id: "oil", name: "Oil", job: "The barrel, on one screen.", color: "#E07A3D", plate: true } },
  { test: (p) => p.startsWith("/gas"), room: { id: "gas", name: "Gas", job: "The molecule, on one screen.", color: "#5ED0C8", plate: true } },
  { test: (p) => p.startsWith("/work"), room: { id: "work", name: "Work", job: "What was done.", color: "#C5CDD6", plate: true } },
  { test: (p) => p.startsWith("/about") || p.startsWith("/bio"), room: { id: "door", name: "About", job: "Who is here.", color: "#E4572E", plate: true } },
  { test: () => true, room: { id: "door", name: "Arif Fazil", job: "Uncertain Earth data, turned into a decision.", color: "#E4572E", plate: false } },
];

export function RoomCoat() {
  const { pathname } = useLocation();
  const room = ROOMS.find((entry) => entry.test(pathname))!.room;

  useLayoutEffect(() => {
    document.documentElement.dataset.room = room.id;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", room.color);
    document.querySelector('meta[name="arif-room"]')?.setAttribute("content", room.id);
    document.querySelector('meta[name="arif-job"]')?.setAttribute("content", room.job);
  }, [room]);

  if (!room.plate) return null;
  return (
    <div className="room-plate" data-agent-room={room.id}>
      <b>{room.name}</b>
      <span>{room.job}</span>
      <a href="/discovery/">Nine rooms</a>
    </div>
  );
}

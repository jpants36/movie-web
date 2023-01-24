import { useVideoPlayerState } from "../VideoContext";

function durationExceedsHour(secs: number): boolean {
  return secs > 60 * 60;
}

function formatSeconds(secs: number, showHours = false): string {
  if (Number.isNaN(secs)) {
    if (showHours) return "0:00:00";
    return "0:00";
  }

  let time = secs;
  const seconds = Math.floor(time % 60);

  time /= 60;
  const minutes = Math.floor(time % 60);

  time /= 60;
  const hours = Math.floor(time);

  const paddedSecs = seconds.toString().padStart(2, "0");
  const paddedMins = minutes.toString().padStart(2, "0");

  if (!showHours) return [paddedMins, paddedSecs].join(":");
  return [hours, paddedMins, paddedSecs].join(":");
}

interface Props {
  className?: string;
  noDuration?: boolean;
}

export function SkipTime(props: Props) {
  const { videoState } = useVideoPlayerState();
  const hasHours = durationExceedsHour(videoState.duration);
  const time = formatSeconds(videoState.time, hasHours);
  const duration = formatSeconds(videoState.duration, hasHours);

  return (
    <div className={props.className}>
      <p className="select-none text-white">
        {time} {props.noDuration ? "" : `/ ${duration}`}
      </p>
    </div>
  );
}

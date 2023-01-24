import { DetailedMeta } from "@/backend/metadata/getmeta";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useCallback, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { AirplayControl } from "./controls/AirplayControl";
import { BackdropControl } from "./controls/BackdropControl";
import { ChromeCastControl } from "./controls/ChromeCastControl";
import { FullscreenControl } from "./controls/FullscreenControl";
import { LoadingControl } from "./controls/LoadingControl";
import { MiddlePauseControl } from "./controls/MiddlePauseControl";
import { MobileCenterControl } from "./controls/MobileCenterControl";
import { PageTitleControl } from "./controls/PageTitleControl";
import { PauseControl } from "./controls/PauseControl";
import { ProgressControl } from "./controls/ProgressControl";
import { QualityDisplayControl } from "./controls/QualityDisplayControl";
import { SeriesSelectionControl } from "./controls/SeriesSelectionControl";
import { ShowTitleControl } from "./controls/ShowTitleControl";
import { SkipTime } from "./controls/SkipTime";
import { SourceSelectionControl } from "./controls/SourceSelectionControl";
import { TimeControl } from "./controls/TimeControl";
import { VolumeControl } from "./controls/VolumeControl";
import { VideoPlayerError } from "./parts/VideoPlayerError";
import { VideoPlayerHeader } from "./parts/VideoPlayerHeader";
import { useVideoPlayerState } from "./VideoContext";
import { VideoPlayer, VideoPlayerProps } from "./VideoPlayer";

interface DecoratedVideoPlayerProps {
  media?: DetailedMeta;
  onGoBack?: () => void;
}

function LeftSideControls() {
  const { videoState } = useVideoPlayerState();

  const handleMouseEnter = useCallback(() => {
    videoState.setLeftControlsHover(true);
  }, [videoState]);
  const handleMouseLeave = useCallback(() => {
    videoState.setLeftControlsHover(false);
  }, [videoState]);

  return (
    <>
      <div
        className="flex items-center px-2"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <PauseControl />
        <TimeControl />
        <VolumeControl className="mr-2" />
        <SkipTime />
      </div>
      <ShowTitleControl />
    </>
  );
}

export function DecoratedVideoPlayer(
  props: VideoPlayerProps & DecoratedVideoPlayerProps
) {
  const top = useRef<HTMLDivElement>(null);
  const center = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const { isMobile } = useIsMobile();

  const onBackdropChange = useCallback(
    (showing: boolean) => {
      setShow(showing);
    },
    [setShow]
  );

  return (
    <VideoPlayer autoPlay={props.autoPlay}>
      <PageTitleControl media={props.media?.meta} />
      <VideoPlayerError media={props.media?.meta} onGoBack={props.onGoBack}>
        <BackdropControl onBackdropChange={onBackdropChange}>
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingControl />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <MiddlePauseControl />
          </div>
          {isMobile ? (
            <CSSTransition
              nodeRef={center}
              in={show}
              timeout={200}
              classNames={{
                exit: "transition-[transform,opacity] duration-200 opacity-100",
                exitActive: "!opacity-0",
                exitDone: "hidden",
                enter: "transition-[transform,opacity] duration-200 opacity-0",
                enterActive: "!opacity-100",
              }}
            >
              <div
                ref={center}
                className="absolute inset-0 flex items-center justify-center"
              >
                <MobileCenterControl />
              </div>
            </CSSTransition>
          ) : (
            ""
          )}
          <CSSTransition
            nodeRef={top}
            in={show}
            timeout={200}
            classNames={{
              exit: "transition-[transform,opacity] translate-y-0 duration-200 opacity-100",
              exitActive: "!-translate-y-4 !opacity-0",
              exitDone: "hidden",
              enter:
                "transition-[transform,opacity] -translate-y-4 duration-200 opacity-0",
              enterActive: "!translate-y-0 !opacity-100",
            }}
          >
            <div
              ref={top}
              className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col py-6 px-8 pb-2"
            >
              <VideoPlayerHeader
                media={props.media?.meta}
                onClick={props.onGoBack}
                isMobile={isMobile}
              />
            </div>
          </CSSTransition>
          <CSSTransition
            nodeRef={bottom}
            in={show}
            timeout={200}
            classNames={{
              exit: "transition-[transform,opacity] translate-y-0 duration-200 opacity-100",
              exitActive: "!translate-y-4 !opacity-0",
              exitDone: "hidden",
              enter:
                "transition-[transform,opacity] translate-y-4 duration-200 opacity-0",
              enterActive: "!translate-y-0 !opacity-100",
            }}
          >
            <div
              ref={bottom}
              className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col px-4 pb-2 [margin-bottom:env(safe-area-inset-bottom)]"
            >
              <div className="flex w-full items-center space-x-3">
                {isMobile && <SkipTime noDuration />}
                <ProgressControl />
              </div>
              <div className="flex items-center">
                {isMobile ? (
                  <div className="grid w-full grid-cols-[56px,1fr,56px] items-center">
                    <div />
                    <div className="flex items-center justify-center">
                      <SeriesSelectionControl />
                      <SourceSelectionControl media={props.media} />
                    </div>
                    <FullscreenControl />
                  </div>
                ) : (
                  <>
                    <LeftSideControls />
                    <div className="flex-1" />
                    <QualityDisplayControl />
                    <SeriesSelectionControl />
                    <SourceSelectionControl media={props.media} />
                    <AirplayControl />
                    <ChromeCastControl />
                    <FullscreenControl />
                  </>
                )}
              </div>
            </div>
          </CSSTransition>
        </BackdropControl>
        {props.children}
      </VideoPlayerError>
    </VideoPlayer>
  );
}

import { Color, UINT_8_SIZE_IN_BYTES, VisualFrame } from "..";

enum SerialMessageTypes {
  /**
   * Keep leds aware of ongoing serial communication.
   *
   * Built-in animations are stopped.
   */
  ping = 0,

  // display following frame
  displayView = 1,
  /**
   * End serial communication and start playing built-in animations
   */
  end = 10,
}

export class RadioPanelView {
  constructor(public readonly index: number, public readonly color: Color) {}

  public copyWith = ({
    index,
    color,
  }: {
    index?: number;
    color?: Color;
  } = {}) => new RadioPanelView(index ?? this.index, color ?? this.color);
}

export class AnimationView {
  constructor(
    public readonly frame: VisualFrame,
    public readonly radioPanels: Array<RadioPanelView>
  ) {}

  public copyWith = ({
    frame,
    radioPanels,
  }: {
    frame?: VisualFrame;
    radioPanels?: Array<RadioPanelView>;
  } = {}) =>
    new AnimationView(
      frame ?? this.frame,
      radioPanels ?? this.radioPanels.slice(0)
    );

  /**
   *  Convert to bytes that can be send over serial (skip duration)
   */
  public toBytes = (): Uint8Array => {
    const getRadioPanelSize = () => {
      const panelIndexSize = UINT_8_SIZE_IN_BYTES;
      const color = UINT_8_SIZE_IN_BYTES * 3;
      return panelIndexSize + color;
    };
    const getFrameSize = () => {
      const colorsSize = this.frame.pixels.length * 3;
      // During serial communication frame duration and type is redundant;
      return colorsSize;
    };
    const radioPanelSize = getRadioPanelSize();
    const radioPanelsSize = radioPanelSize * this.radioPanels.length;
    const frameSize = getFrameSize();
    const messageTypeSize = UINT_8_SIZE_IN_BYTES;
    const viewSize = messageTypeSize + frameSize + radioPanelsSize;

    const bytes = new Uint8Array(viewSize);
    let pointer = 0;

    // Set message type
    bytes[pointer++] = SerialMessageTypes.displayView;
    /// frame pixels
    const pixels = this.frame.pixels;
    for (let i = 0; i < pixels.length; i++) {
      bytes[pointer++] = pixels[i].red;
      bytes[pointer++] = pixels[i].green;
      bytes[pointer++] = pixels[i].blue;
    }
    /// encode radio panels
    for (let i = 0; i < this.radioPanels.length; i++) {
      const radioPanelView = this.radioPanels[i];

      /// panel index
      bytes[pointer++] = radioPanelView.index;
      /// color
      bytes[pointer++] = radioPanelView.color.red;
      bytes[pointer++] = radioPanelView.color.green;
      bytes[pointer++] = radioPanelView.color.blue;
    }

    return bytes;
  };
}

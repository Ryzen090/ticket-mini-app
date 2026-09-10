import classNames from "classnames";
import Image, { ImageLoaderProps } from "next/image";
import { CSSProperties, useState, useEffect } from "react";

export type MyImageProps = {
  src: string | undefined;
  alt?: string;
  className?: string;
  width?: number;
  style?: CSSProperties | undefined;
  height?: number;
  priority?: boolean;
  onClick?: () => void;
  fallbackSrc?: string;
};

function MyImage(props: MyImageProps) {
  const {
    src,
    alt = "Image",
    width = 500,
    height = 500,
    className: classNameProps = "",
    style = {},
    priority = false,
    fallbackSrc = "",
  } = props;

  const [srcImage, setSrcImage] = useState(src || fallbackSrc);

  useEffect(() => {
    if (src) {
      setSrcImage(src);
    }
  }, [src]);

  const myLoader = ({ src, width, quality }: ImageLoaderProps) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  function onClickOnImage() {
    const { onClick } = props;
    if (onClick) {
      onClick();
    }
  }

  function onErrorLoadImage() {
    setSrcImage(fallbackSrc);
  }

  const classNameBind = classNames(classNameProps);

  return (
    <Image
      src={srcImage}
      alt={alt}
      style={style}
      width={width}
      height={height}
      className={classNameBind}
      onClick={onClickOnImage}
      loader={myLoader}
      onError={onErrorLoadImage}
      priority={priority}
    />
  );
}

export default MyImage;

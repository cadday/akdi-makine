import { Link } from "react-router";

import { Box, Button } from "@mui/material";

import { cn } from "@/lib/utils";
import { useThemeContext } from "@/theme/theme-provider";
import { ContentType } from "@/types/types";

export default function Footer() {
  const { content } = useThemeContext();

  return (
    <Box component='footer' className='flex h-12 items-center shadow-grey-100 shadow-[0_-1px_0px_0px_rgba(0,0,0,0.1)]'>
      <Box className={cn("mx-auto w-full px-4 md:px-6 lg:px-8 flex flex-row justify-between items-center", content === ContentType.Boxed && "max-w-340")}>
        <Box>
          <Button
            size='tiny'
            color='text-secondary'
            variant='text'
            className='hover:text-primary bg-transparent! font-normal'
            component={Link}
            to='https://akdimakine.com'
            target='_blank'
          >
            akdimakine.com
          </Button>
        </Box>
        <Box>
          <Button
            size='tiny'
            color='text-secondary'
            variant='text'
            className='hover:text-primary bg-transparent! font-normal'
            component={Link}
            to='https://www.youtube.com/@AKDIMAKINE'
            target='_blank'
          >
            Videos
          </Button>
          <Button
            size='tiny'
            color='text-secondary'
            variant='text'
            className='hover:text-primary bg-transparent! font-normal'
            component={Link}
            to='https://akdimakine.com/iletisim/'
            target='_blank'
          >
            Contact
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

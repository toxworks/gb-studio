#include "MusicManager.h"

#include "BankData.h"
#include "BankManager.h"
#include "data_ptrs.h"
#include "gbt_player.h"

#define MAX_MUSIC 255

UBYTE current_index = MAX_MUSIC;
UBYTE tone_frames = 0;

void MusicPlay(UBYTE index, UBYTE loop, UBYTE return_bank) {
  UBYTE music_bank;

  if (index != current_index) {
    current_index = index;
    music_bank = ReadBankedUBYTE(DATA_PTRS_BANK, &music_banks[index]);

    PUSH_BANK(return_bank);
#ifndef __EMSCRIPTEN__
    PUSH_BANK(DATA_PTRS_BANK);
    gbt_play(music_tracks[index], music_bank, 7);
    gbt_loop(loop);
    POP_BANK;
#endif
    POP_BANK;
  }
}

void MusicStop(UBYTE return_bank) {
  PUSH_BANK(return_bank);
#ifndef __EMSCRIPTEN__
  gbt_stop();
#endif
  current_index = MAX_MUSIC;
  POP_BANK;
}

void MusicUpdate() {
#ifndef __EMSCRIPTEN__
  gbt_update();
#endif
  REFRESH_BANK;

  if(tone_frames != 0) {
    tone_frames--;
    if(tone_frames == 0) {
      SoundStopTone();
    }
  }
}

void SoundPlayTone(UWORD tone, UBYTE frames) {
  tone_frames = frames;

  // enable sound
  NR52_REG = 0x80;

  // play tone on channel 1
  NR10_REG = 0x00;
  NR11_REG = (0x00 << 6) | 0x01;
  NR12_REG = (0x0F << 4) | 0x00;
  NR13_REG = (tone & 0x00FF);
  NR14_REG = 0x80 | ((tone & 0x0700) >> 8);

  // enable volume
  NR50_REG = 0x77;

  // enable channel 1
  NR51_REG |= 0x11;
}


void SoundStopTone() {
  // stop tone on channel 1
  NR12_REG = 0x00;
}

void SoundPlayBeep(UBYTE pitch) {
  // enable sound
  NR52_REG = 0x80;

  // play beep sound on channel 4
  NR41_REG = 0x01;
  NR42_REG = (0x0F << 4);
  NR43_REG = 0x20 | 0x08 | pitch;
  NR44_REG = 0x80 | 0x40;

  // enable volume
  NR50_REG = 0x77;

  // enable channel 4
  NR51_REG |= 0x88;

  // no delay
}

void SoundPlayCrash() {
  // enable sound
  NR52_REG = 0x80;

  // play crash sound on channel 4
  NR41_REG = 0x01;
  NR42_REG = (0x0F << 4) | 0x02;
  NR43_REG = 0x13;
  NR44_REG = 0x80;

  // enable volume
  NR50_REG = 0x77;

  // enable channel 4
  NR51_REG |= 0x88;

  // no delay
}
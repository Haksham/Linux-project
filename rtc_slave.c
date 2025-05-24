#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/mman.h>
#include <stdint.h>

struct rtc_shared_time {
    uint64_t seconds;
    uint32_t nanoseconds;
};

int main() {
    int fd = open("/dev/rtc_shm", O_RDWR);
    if (fd < 0) {
        perror("open");
        return 1;
    }

    struct rtc_shared_time *rtc_time = mmap(NULL, getpagesize(),
                                             PROT_READ | PROT_WRITE,
                                             MAP_SHARED, fd, 0);
    if (rtc_time == MAP_FAILED) {
        perror("mmap");
        close(fd);
        return 1;
    }

    printf("Shared Memory RTC Time:\n");
    printf("  Seconds     : %llu\n", rtc_time->seconds);
    printf("  Nanoseconds : %u\n", rtc_time->nanoseconds);

    // Optional: manually set system time (for testing)
    /*
    struct timespec ts = {
        .tv_sec = rtc_time->seconds,
        .tv_nsec = rtc_time->nanoseconds
    };
    clock_settime(CLOCK_REALTIME, &ts);
    */

    munmap(rtc_time, getpagesize());
    close(fd);
    return 0;
}

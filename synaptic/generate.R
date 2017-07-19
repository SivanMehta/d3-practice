library(dplyr)
library(ggplot2)
rm(list = ls())
x1 <- runif(1000, 0, 2)
y1 <- runif(1000, 0, 2)
x2 <- runif(1000, .75, 2.75)
y2 <- runif(1000, 0.5, 2.5)

upper <- data.frame(x1, y1) %>%
  filter((x1 - 1)**2 + (y1 - 1)**2 < 1) %>%
  filter((x1 - 1)**2 + (y1 - 1)**2 > .4) %>%
  filter(y1 > 1) %>%
  mutate(label = 'upper')

upper %>%
  ggplot(aes(x = x1, y = y1)) + geom_point()

lower <- data.frame(x2, y2) %>%
  filter((x2 - 1.75)**2 + (y2 - 1.5)**2 < 1) %>%
  filter((x2 - 1.75)**2 + (y2 - 1.5)**2 > .4) %>%
  filter(y2 < 1.5) %>%
  mutate(label = 'lower') %>%
  mutate(y1 = y2) %>% mutate(x1 = x2) %>%
  select(x1, y1, label)

dataset <- rbind(upper, lower) %>% mutate(x = x1, y = y1) %>% select(x, y, label)

write.csv(dataset, "synaptic/boomerang.csv")

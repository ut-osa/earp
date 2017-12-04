library(ggplot2)


## Summarizes data.
## Gives count, mean, standard deviation, standard error of the mean, and confidence interval (default 95%).
##   data: a data frame.
##   measurevar: the name of a column that contains the variable to be summariezed
##   groupvars: a vector containing names of columns that contain grouping variables
##   na.rm: a boolean that indicates whether to ignore NA's
##   conf.interval: the percent range of the confidence interval (default is 95%)
summarySE <- function(data=NULL, measurevar, groupvars=NULL, na.rm=FALSE,
                      conf.interval=.95, .drop=TRUE) {
    require(plyr)

    # New version of length which can handle NA's: if na.rm==T, don't count them
    length2 <- function (x, na.rm=FALSE) {
        if (na.rm) sum(!is.na(x))
        else       length(x)
    }

    # This does the summary. For each group's data frame, return a vector with
    # N, mean, and sd
    datac <- ddply(data, groupvars, .drop=.drop,
      .fun = function(xx, col) {
        c(N    = length2(xx[[col]], na.rm=na.rm),
          mean = mean   (xx[[col]], na.rm=na.rm),
          sd   = sd     (xx[[col]], na.rm=na.rm)
        )
      },
      measurevar
    )

    # Rename the "mean" column    
    datac <- rename(datac, c("mean" = measurevar))

    datac$se <- datac$sd / sqrt(datac$N)  # Calculate standard error of the mean

    # Confidence interval multiplier for standard error
    # Calculate t-statistic for confidence interval: 
    # e.g., if conf.interval is .95, use .975 (above/below), and use df=N-1
    ciMult <- qt(conf.interval/2 + .5, datac$N-1)
    datac$ci <- datac$se * ciMult

    return(datac)
}
data = read.csv("grand_data_sheet.csv")

summarized <- summarySE(data, measurevar="ms", groupvars=c("group", "sys", "action"))
summarized$action <- factor(summarized$action, levels=
   c('insert', 'queryName', 'queryTel', 'enum', 'insertBlobSmall',
     'insertBlobLarge', 'readBlobSmall', 'readBlobLarge', 'IAC'), 
   labels=c('Contact\nInsert', 'Contact\nGetName',
            'Contact\nGetTel', 'Contact\nEnum',
            'Photo\nInsertSm', 'Photo\nInsertLg',
            'Photo\nGetSm', 'Photo\nGetLg', 'IAC'),
                            ordered=TRUE)
summarized$group <- factor(summarized$group)

plot = ggplot(summarized, aes(x=action, y=ms, fill=sys, grid=group)) + 
    geom_bar(position=position_dodge(), stat="identity",
             colour="black", # Use black outlines,
             size=.3) +      # Thinner lines
    geom_errorbar(aes(ymin=ms-se, ymax=ms+se),
                  size=.3,    # Thinner lines
                  width=.2,
                  position=position_dodge(.9)) +

    ylab("Run Time (ms)") +
    xlab("") + 
    scale_fill_manual(name="",# Legend label, use darker colors
                   values=c("lightgray", "white"),
                   breaks=c("Earp", "FFOS"),
                   labels=c("Earp","FFOS")) +
        scale_y_log10(breaks=c(1,10,100,1000,10000)) +
        theme_bw()

